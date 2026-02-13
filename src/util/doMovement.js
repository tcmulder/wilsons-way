import { useEffect } from 'react';
import { gsap } from 'gsap';
import { checkCollisions, checkElevation } from './handleCollisions';

/**
 * Track movement (fires whenever moving left/right)
 */
export const trackMovement = (props) => {
	const { gameplayContextRef, setCharacterStatus } = props;
	const { elsRef, elevationRef, statusRef, jumpRef } = gameplayContextRef.current;
	if (!elsRef?.current || (statusRef?.current?.move === 'none' && statusRef?.current?.jump === 'none')) return;
	const els = elsRef?.current;
	checkCollisions(els);
	checkElevation(els, elevationRef);
	doGravity({ setCharacterStatus, statusRef, elevationRef, elsRef, jumpRef });
};

/**
 * Fall off the edge of a shelf to the next one down
 */
const doGravity = (props) => {
	if (props.statusRef?.current?.jump !== 'none') return;
	const { elevationRef } = props;
	const { foot, below } = elevationRef.current;
	if(foot > below) {
		doJumpDown(props);
	}
};

/**
 * Pause playback
 */
export const doPause = ({timelines, setCharacterStatus}) => {
	if (!timelines.length) return;
	setCharacterStatus(prev => ({...prev, move: 'none'}));
	timelines.forEach(timeline => timeline.pause());
};

/**
 * Play playback
 */
export const doRun = ({timelines, setCharacterStatus, direction = 'forward'}) => {
	if (!timelines?.length) return;
	setCharacterStatus(prev => ({...prev, move: direction === 'backward' ? 'backward' : 'forward'}));
	timelines.forEach(timeline => {
		if (!timeline) return;
		if (direction === 'backward') {
			timeline.reverse();
		} else {
			timeline.play();
		}
	});
};

/**
 * Jump down
 */
const doJumpDown = (props) => {
	const { setCharacterStatus, jumpRef, elevationRef, elsRef } = props;
	setCharacterStatus(prev => ({ ...prev, jump: 'down' }));
	const elCharacter = elsRef.current.elCharacter;
	const fudge = 7;
	const tlDown = gsap.timeline();
	tlDown.to(elCharacter, {
		onComplete: () => setCharacterStatus(prev => ({ ...prev, jump: 'none' })),
		onUpdate: () => {
			if(elevationRef.current.foot - fudge <= elevationRef.current.below) {
				tlDown.kill();
				gsap.set(elCharacter, { y: -elevationRef.current.below });
				setCharacterStatus(prev => ({ ...prev, jump: 'none' }));
			}
		},
		y: elevationRef.current.floor * -1,
		duration: jumpRef.current.hangtime / 2,
		ease: "power1.in",
	});
};

/**
 * Jump up
 */
const doJumpUp = (props) => {
	const { setCharacterStatus, jumpRef, elevationRef, elsRef } = props;
	setCharacterStatus(prev => ({ ...prev, jump: 'up' }));
	const elCharacter = elsRef.current.elCharacter;
	const targetHeight = jumpRef.current.height + elevationRef.current.below;
	const fudge = 7;
	const tlUp = gsap.timeline();
	tlUp.to(elCharacter, {
		y: targetHeight * -1,
		duration: jumpRef.current.hangtime / 2,
		ease: "power1.out",
		onUpdate: () => {
			if(elevationRef.current.head + fudge >= elevationRef.current.above) {
				tlUp.kill();
				doJumpDown(props);
			}
		},
		onComplete: () => doJumpDown(props),
	});
};

/**
 * Jump up and down
 */
const doJump = (props) => {
	// Prevent double-jumps while already mid-air
	if (props.statusRef?.current?.jump !== 'none') return;
	if (!props.elsRef?.current?.elCharacter) return;

	doJumpUp(props);
};

/**
 * Movements hook
 * @param {Object} props The properties object
 * @param {Object} props.debug Whether debug mode is enabled
 * @param {Object} props.elsRef The els ref object
 * @param {Object} props.characterStatus The character status (move, jump)
 * @param {Function} props.setCharacterStatus Setter for character status
 * @param {Object} props.timelinesRef The timelines ref object
 * @param {Object} props.jumpRef The jump object (height in em units and hangtime in seconds)
 * @param {Object} props.elevationRef The elevation ref object
 * @param {Object} props.statusRef The status ref object
 * @param {*} [props.currentLevelId] Level load id so autoplay runs after level (and timelines) exist
 */
export function useCharacterMovement({
	debug,
	elsRef,
	characterStatus,
	setCharacterStatus,
	jumpRef,
	timelinesRef,
	elevationRef,
	statusRef,
	currentLevelId,
}) {
  // Auto-play when debug autoplay is not '0', and only once timelines exist (level has loaded)
  useEffect(() => {
	if (debug?.autoplay !== false && timelinesRef.current?.length) {
	  doRun({ timelines: timelinesRef.current, setCharacterStatus, direction: 'forward' });
	}
  }, [debug, timelinesRef, setCharacterStatus, currentLevelId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
		// Ignore auto-repeat so logic only runs once per key press
		if (e.repeat) return;
		if (e.key === 'ArrowUp' || e.key === ' ') {
			e.preventDefault();
			doJump({ elsRef, setCharacterStatus, jumpRef, elevationRef, statusRef });
		}

		if (debug?.autoplay === false) {
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
	  if (debug?.autoplay === false) {
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
  }, [debug, characterStatus, setCharacterStatus, jumpRef, timelinesRef, elevationRef, statusRef, elsRef]);
}
