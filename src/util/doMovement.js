import { useEffect } from 'react';
import { gsap } from 'gsap';
import { checkCollisions, checkElevation } from './handleCollisions';

/**
 * Track movement (fires whenever moving left/right)
 *
 * @param {Object} props The properties object
 * @param {Object} props.gameplayContext Gameplay refs and state
 * @param {Function} props.setCharacterStatus Setter for character status
 * @param {Function} props.setScore Setter for score
 * @param {number} props.level The current level number
 * @param {string[]} props.characterModifiers The current character modifiers
 * @param {Function} props.playSound Function to play a sound ('positive' | 'negative')
 * @param {Function} props.setCharacterModifiers Setter for character modifiers
 */
export const trackMovement = (props) => {
	const { gameplayContext, setCharacterStatus, setScore, level, characterModifiers, playSound, setCharacterModifiers } = props;
	const { elsRef, elevationRef, statusRef, jumpRef } = gameplayContext;
	if (!elsRef?.current || (statusRef?.current?.move === 'none' && statusRef?.current?.jump === 'none')) return;
	const els = elsRef?.current;
	checkCollisions({
		els,
		setScore,
		level,
		characterModifiers,
		playSound,
		setCharacterModifiers,
	});
	checkElevation(els, elevationRef);
	doGravity({ setCharacterStatus, statusRef, elevationRef, elsRef, jumpRef });
};

/**
 * Fall off the edge of a shelf to the next one down
 *
 * @param {Object} props The properties object
 * @param {Function} props.setCharacterStatus Setter for character status
 * @param {Object} props.statusRef The status ref object
 * @param {Object} props.elevationRef The elevation ref object
 * @param {Object} props.elsRef The els ref object
 * @param {Object} props.jumpRef The jump ref object
 */
const doGravity = (props) => {
	const { setCharacterStatus, statusRef, elevationRef, elsRef, jumpRef } = props;
	if (statusRef?.current?.jump !== 'none') return;
	const { foot, below } = elevationRef.current;
	if(foot > below) {
		doJumpDown({
			setCharacterStatus,
			jumpRef,
			elevationRef,
			elsRef,
		});
	}
};

/**
 * Freeze or resume all GSAP animations (global timeline).
 *
 * @param {boolean} [shouldFreeze=true] If true, pause; if false, resume.
 */
export const doFreeze = (shouldFreeze = true) => {
	if(shouldFreeze) {
		gsap.globalTimeline.pause();
	} else {
		gsap.globalTimeline.resume();
	}
};

/**
 * Pause level timeline playback and set character animation state to none.
 *
 * @param {Object} props
 * @param {import('gsap').Timeline[]} props.timelines Level timelines to pause.
 * @param {Function} props.setCharacterStatus Setter for character status.
 */
export const doPause = (props) => {
	const { timelines, setCharacterStatus } = props;
	if (!timelines.length) return;
	setCharacterStatus(prev => ({...prev, ani: 'none'}));
	timelines.forEach(timeline => timeline.pause());
};

/**
 * Start or resume level timeline playback in the given direction.
 *
 * @param {Object} props
 * @param {import('gsap').Timeline[]} props.timelines Level timelines to play.
 * @param {Function} props.setCharacterStatus Setter for character status.
 * @param {'forward'|'backward'} [props.direction='forward'] Play direction (backward reverses timelines).
 */
export const doRun = (props) => {
	const { timelines, setCharacterStatus, direction = 'forward' } = props;
	if (!timelines?.length) return;
	setCharacterStatus(prev => ({
		...prev,
		move: direction === 'backward' ? 'backward' : 'forward',
		ani: 'sprite',
	}));
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
 * 
 * @param {Object} props The properties object
 * @param {Function} props.setCharacterStatus Setter for character status
 * @param {Object} props.jumpRef The jump object (height in em units and hangtime in seconds)
 * @param {Object} props.elevationRef The elevation ref object
 * @param {Object} props.elsRef The els ref object
 */
const doJumpDown = (props) => {
	if (isFrozen()) return;
	const { setCharacterStatus, jumpRef, elevationRef, elsRef } = props;
	setCharacterStatus(prev => ({ ...prev, jump: 'down' }));
	const elCharacter = elsRef.current.elCharacter;
	const fudge = 7;
	const tlDown = gsap.timeline();
	elCharacter.classList.add('is-frozen');
	tlDown.to(elCharacter, {
		onComplete: () => {
			elCharacter.classList.remove('is-frozen');
			setCharacterStatus(prev => ({ ...prev, jump: 'none' }));
		},
		onUpdate: () => {
			if(elevationRef.current.foot - fudge <= elevationRef.current.below) {
				elCharacter.classList.remove('is-frozen');
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
 * Animate character jumping upward; on peak or obstacle hit, triggers doJumpDown.
 *
 * @param {Object} props Same as doJumpDown (setCharacterStatus, jumpRef, elevationRef, elsRef).
 */
const doJumpUp = (props) => {
	if (isFrozen()) return;
	const { setCharacterStatus, jumpRef, elevationRef, elsRef } = props;
	setCharacterStatus(prev => ({ ...prev, jump: 'up' }));
	const elCharacter = elsRef.current.elCharacter;
	const targetHeight = jumpRef.current.height + elevationRef.current.below;
	const fudge = 7;
	const tlUp = gsap.timeline();
	elCharacter.classList.add('is-frozen');
	tlUp.to(elCharacter, {
		y: targetHeight * -1,
		duration: jumpRef.current.hangtime / 2,
		ease: "power1.out",
		onUpdate: () => {
			if(elevationRef.current.head + fudge >= elevationRef.current.above) {
				tlUp.kill();
				elCharacter.classList.remove('is-frozen');
				doJumpDown(props);
			}
		},
		onComplete: () => {
			elCharacter.classList.remove('is-frozen');
			doJumpDown(props);
		},
	});
};

/**
 * Jump up and down
 *
 * @param {Object} props The properties object
 * @param {Function} props.setCharacterStatus Setter for character status
 * @param {Object} props.jumpRef The jump object (height in em units and hangtime in seconds)
 * @param {Object} props.elevationRef The elevation ref object
 * @param {Object} props.elsRef The els ref object
 * @param {Object} props.statusRef The status ref object
 */
const doJump = (props) => {
	const { statusRef, elsRef } = props;
	// Prevent double-jumps while already mid-air
	if (statusRef?.current?.jump !== 'none') return;
	if (!elsRef?.current?.elCharacter) return;

	doJumpUp(props);
};

/**
 * Check if we're frozen (e.g. a milestone is visible)
 */
const isFrozen = () => {
	return document.querySelector('.is-frozen') !== null;
};

/**
 * Hook: keyboard-driven movement (jump, play/pause, direction) and autoplay when level is ready.
 *
 * @param {Object} props The properties object
 * @param {Object|null} [props.debug] Debug state; when autoplay is false, Arrow keys control play/pause/direction.
 * @param {Object} props.elsRef React ref to board/character/shelves/obstacles
 * @param {Object} props.characterStatus The character status (move, jump)
 * @param {Function} props.setCharacterStatus Setter for character status
 * @param {Object} props.timelinesRef The timelines ref object
 * @param {Object} props.jumpRef The jump object (height in em units and hangtime in seconds)
 * @param {Object} props.elevationRef The elevation ref object
 * @param {Object} props.statusRef The status ref object
 * @param {*} [props.currentLevelId] Level load id so autoplay runs after level (and timelines) exist
 */
export function useCharacterMovement(props) {
	const {
		debug,
		elsRef,
		characterStatus,
		setCharacterStatus,
		jumpRef,
		timelinesRef,
		elevationRef,
		statusRef,
		currentLevelId,
	} = props;
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
			if (isFrozen()) return;
			doJump({ elsRef, setCharacterStatus, jumpRef, elevationRef, statusRef });
		}

		if (debug?.autoplay === false) {
			if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (isFrozen()) return;
			// Toggle play/pause on each ArrowDown press
			if (characterStatus.ani === 'none') {
				// Not moving: play forward
				doRun({ direction: 'forward', timelines: timelinesRef.current, setCharacterStatus });
			} else {
				// Currently moving: pause
				doPause({ timelines: timelinesRef.current, setCharacterStatus });
			}
			}
			if (e.key === 'ArrowRight') {
				e.preventDefault();
				if (isFrozen()) return;
				doRun({ direction: 'forward', timelines: timelinesRef.current, setCharacterStatus });
			}
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				if (isFrozen()) return;
				doRun({ direction: 'backward', timelines: timelinesRef.current, setCharacterStatus });
			}
		}
	};

	const handleKeyUp = (e) => {
		if (debug?.autoplay === false) {
		if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
			e.preventDefault();
			if (isFrozen()) return;
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
