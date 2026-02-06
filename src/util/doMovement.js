import { useEffect } from 'react';
import { gsap } from 'gsap';
import { checkCollisions, checkElevation } from './handleCollisions';

/**
 * Track movement (fires whenever moving left/right)
 */
export const trackMovement = ({elsRef, elevationRef, statusRef}) => {
	if (!elsRef?.current || (statusRef?.current?.move === 'none' && statusRef?.current?.jump === 'none')) return;
	const els = elsRef?.current;
	checkCollisions(els);
	checkElevation(els, elevationRef);
	doGravity({els, elevationRef, statusRef});
	console.table(elevationRef.current)
}

/**
 * Fall off the edge of a shelf to the next one down
 */
const doGravity = ({els, elevationRef, statusRef}) => {
	// const { elCharacter } = els;
	// const { isNew, below } = elevationRef.current;
	// if(isNew && statusRef.current.jump === 'none') {
	// 	const tl = gsap.timeline();
	// 	const landingY = `-${below}em`;
	// 	tl.to(elCharacter, {
	// 		// onStart: () => setCharacterStatus(prev => ({ ...prev, jump: 'down' })),
	// 		// onComplete: () => setCharacterStatus(prev => ({ ...prev, jump: 'none' })),
	// 		y: landingY,
	// 		// duration: jump.hangtime,
	// 		duration: 0.5,
	// 		ease: "power1.in",
	// 	});
	// }
}

/**
 * Pause playback
 */
export const doPause = ({timelines, setCharacterStatus}) => {
	if (!timelines.length) return;
	timelines.forEach(timeline => timeline.pause());
	setCharacterStatus(prev => ({...prev, move: 'none'}));
}

/**
 * Play playback
 */
export const doPlay = ({timelines, setCharacterStatus, direction = 'forward'}) => {
	if (!timelines?.length) return;

	timelines.forEach(timeline => {
		if (!timeline) return;
		if (direction === 'backward') {
			timeline.reverse();
		} else {
			timeline.play();
		}
	});

	setCharacterStatus(prev => ({...prev, move: direction === 'backward' ? 'backward' : 'forward'}));
}

/**
 * Jump
 */
const doJump = ({characterRef, setCharacterStatus, jump, elevationRef, statusRef}) => {
	// Prevent double-jumps while already mid-air
	if (statusRef?.current?.jump !== 'none') return;
	if (!characterRef?.current) return;

	const elCharacter = characterRef.current;

	const fudge = characterRef?.current?.getBoundingClientRect().height * 0.05; // Prevents character's head from hitting shelf above
	const targetHeight = jump.height + elevationRef.current.below;
	const up = () => {
		const tlUp = gsap.timeline();
		tlUp.to(elCharacter, {
			onStart: () => setCharacterStatus(prev => ({ ...prev, jump: 'up' })),
			y: targetHeight * -1,
			duration: jump.hangtime,
			ease: "power1.out",
			onUpdate: () => {
				if(elevationRef.current.head + fudge >= elevationRef.current.above) {
					tlUp.kill();
					down();
				}
			},
			onComplete: down,
		})
	}
	const down = () => {
		const tlDown = gsap.timeline();
		tlDown.to(elCharacter, {
			onStart: () => setCharacterStatus(prev => ({ ...prev, jump: 'down' })),
			onComplete: () => setCharacterStatus(prev => ({ ...prev, jump: 'none' })),
			onUpdate: () => {
				if(elevationRef.current.foot - fudge <= elevationRef.current.below) {
					tlDown.kill();
					gsap.set(elCharacter, { y: -elevationRef.current.below - fudge });
					setCharacterStatus(prev => ({ ...prev, jump: 'none' }))
				}
			},
			y: elevationRef.current.floor * -1,
			duration: jump.hangtime,
			ease: "power1.in",
		});
	}
	up();
}

/**
 * Run
 */
const doRun = ({direction, timelines, setCharacterStatus}) => {
	// Update movement direction in status
	setCharacterStatus(prev => ({ ...prev, move: direction }));

	// Control GSAP timelines based on direction (forward or backward)
	doPlay({ timelines, setCharacterStatus, direction });
}

/**
 * Movements hook
 * @param {Object} props The properties object
 * @param {Object} props.debug Whether debug mode is enabled
 * @param {Object} props.characterRef The character DOM element
 * @param {Object} props.characterStatus The character status (move, jump)
 * @param {Function} props.setCharacterStatus Setter for character status
 * @param {Object} props.timelinesRef The timelines ref object
 * @param {Object} props.jump The jump object (height in em units and hangtime in seconds)
 * @param {Object} props.elevationRef The elevation ref object
 * @param {Object} props.statusRef The status ref object
 */
export function useCharacterMovement({ debug, characterRef, characterStatus, setCharacterStatus, jump, timelinesRef, elevationRef, statusRef }) {
  // Auto-play timelines when debug autoplay is not explicitly disabled (autoplay !== '0')
  useEffect(() => {
	if (debug?.autoplay !== '0') {
	  doPlay({ timelines: timelinesRef.current, setCharacterStatus, direction: 'forward' });
	}
  }, [debug, timelinesRef, setCharacterStatus]);

  useEffect(() => {
    const handleKeyDown = (e) => {
		// Ignore auto-repeat so logic only runs once per key press
		if (e.repeat) return;
		if (e.key === 'ArrowUp' || e.key === ' ') {
			e.preventDefault();
			doJump({ characterRef, setCharacterStatus, jump, elevationRef, statusRef });
		}

		if (debug?.autoplay === '0') {
		  if (e.key === 'ArrowDown') {
			e.preventDefault();
			// Toggle play/pause on each ArrowDown press
			if (characterStatus.move === 'none') {
			  // Not moving: play forward
			  doRun({ direction: 'forward', timelines: timelinesRef.current, setCharacterStatus });
			} else {
			  // Currently moving: pause
			  doPause({ timelines: timelinesRef.current, setCharacterStatus });
			}
		  }
		  if (e.key === 'ArrowRight') {
			e.preventDefault();
			doRun({ direction: 'forward', timelines: timelinesRef.current, setCharacterStatus });
		  }
		  if (e.key === 'ArrowLeft') {
			e.preventDefault();
			doRun({ direction: 'backward', timelines: timelinesRef.current, setCharacterStatus });
		  }
		}
	};

	const handleKeyUp = (e) => {
	  if (debug?.autoplay === '0') {
		if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
		  e.preventDefault();
		  doPause({ timelines: timelinesRef.current, setCharacterStatus });
		}
	  }
	};

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
	  window.removeEventListener('keydown', handleKeyDown);
	  window.removeEventListener('keyup', handleKeyUp);
	};
  }, [debug, characterStatus, setCharacterStatus, characterRef, jump, timelinesRef, elevationRef, statusRef]);
}
