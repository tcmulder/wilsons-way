import { useEffect } from 'react';
import { gsap } from 'gsap';
import { checkCollisions, checkElevation } from './handleCollisions';

/**
 * Track movement (fires whenever moving left/right)
 */
export const trackMovement = (elsRef, elevationRef) => {
	const els = elsRef?.current;
	if (!els) return;
	checkCollisions(els);
	checkElevation(els, elevationRef);
	doGravity(els);
}

/**
 * Fall off the edge of a shelf to the next one down
 */
const doGravity = (els) => {
	console.log('🤞', 'checkig gravity', els)
}

/**
 * Pause playback
 */
export const doPause = ({timelines, setCharacterStatus}) => {
	if (!timelines.length) return;
	timelines.forEach(timeline => timeline.pause());
	setCharacterStatus(prev => ({...prev, pause: 'pause'}));
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

	setCharacterStatus(prev => ({...prev, pause: 'none'}));
}

/**
 * Jump
 */
const doJump = ({characterRef, setCharacterStatus, characterStatus, jump, elevationRef}) => {
	// Prevent double-jumps while already mid-air
	if (characterStatus?.jump !== 'none') return;
	if (!characterRef?.current) return;

	const elCharacter = characterRef.current;

	const tl = gsap.timeline();

	const fudge = 1.5;
	const apexHeight = Math.min(
		jump.height + elevationRef.current.below - fudge,
		elevationRef.current.above - fudge
	);
	tl.to(elCharacter, {
		onStart: () => setCharacterStatus(prev => ({ ...prev, jump: 'up' })),
		y: `-${apexHeight - fudge}em`,
		duration: jump.hangtime,
		ease: "power1.out",
	}).add(() => {
		// Add the "down" tween here so we read elevationRef.current.below when
		// the down phase starts, not when the timeline was built (so landing
		// uses updated elevation after moving during the jump).
		const landingY = `-${elevationRef.current.below}em`;
		tl.to(elCharacter, {
			onStart: () => setCharacterStatus(prev => ({ ...prev, jump: 'down' })),
			onComplete: () => setCharacterStatus(prev => ({ ...prev, jump: 'none' })),
			y: landingY,
			duration: jump.hangtime,
			ease: "power1.in",
		});
	});
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
 * @param {Object} props.characterStatus The character status (move, jump, pause)
 * @param {Function} props.setCharacterStatus Setter for character status
 * @param {Object} props.timelinesRef The timelines ref object
 * @param {Object} props.jump The jump object (height in em units and hangtime in seconds)
 */
export function useCharacterMovement({ debug, characterRef, characterStatus, setCharacterStatus, jump, timelinesRef, elevationRef }) {
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
			doJump({ characterRef, setCharacterStatus, characterStatus, jump, elevationRef });
		}

		if (debug?.autoplay === '0') {
		  if (e.key === 'ArrowDown') {
			e.preventDefault();
			// Toggle play/pause on each ArrowDown press
			if (characterStatus.pause === 'pause') {
			  // Currently paused: play forward
			  doRun({ direction: 'forward', timelines: timelinesRef.current, setCharacterStatus });
			} else {
			  // Currently playing: pause
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
  }, [debug, characterStatus, setCharacterStatus, characterRef, jump, timelinesRef]);
}
