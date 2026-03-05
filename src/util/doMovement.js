import { useEffect } from 'react';
import { gsap } from 'gsap';
import { checkCollisions, checkElevation } from './handleCollisions';

/**
 * Track movement
 *
 * @param {Object} props The properties object
 * @param {Object} props.collisionsArgs Props for checkCollisions and nested collision handlers.
 * @param {Object} props.elevationArgs Props for checkElevation (elsRef, elevationRef).
 * @param {Object} props.gravityArgs Props for doGravity (setCharacterStatus, statusRef, elevationRef, elsRef, jumpRef).
 */
export const trackMovement = (props) => {
	const {
		trackMovementArgs,
		collisionsArgs,
		elevationArgs,
		gravityArgs,
	} = props;
	const { elsRef, statusRef } = trackMovementArgs;
	if (!elsRef?.current || (statusRef?.current?.move === 'none' && statusRef?.current?.jump === 'none')) return;
	checkCollisions({
		// Used by the checkCollisions itself
		collisionArgs: {
			elsRef: collisionsArgs.elsRef,
		},
		// Passed through to doModifiers function
		modifiersArgs: {
			characterModifiers: collisionsArgs.characterModifiers,
			setCharacterModifiers: collisionsArgs.setCharacterModifiers,
		},
		// Passed through to doScoring function
		scoringArgs: {
			elsRef: collisionsArgs.elsRef,
			setScore: collisionsArgs.setScore,
			level: collisionsArgs.level,
			characterModifiers: collisionsArgs.characterModifiers,
			playSound: collisionsArgs.playSound,
		},
		// Passed through to doLives function
		livesArgs: {
			elsRef: collisionsArgs.elsRef,
			lives: collisionsArgs.lives,
			setLives: collisionsArgs.setLives,
			setGameplayNavigation: collisionsArgs.setGameplayNavigation,
			debug: collisionsArgs.debug,
		},
		// Passed through to doMilestones function
		milestonesArgs: {
			elsRef: collisionsArgs.elsRef,
			userAdjustedMilestone: collisionsArgs.userAdjustedMilestone,
		},
	});
	checkElevation(elevationArgs);
	doGravity(gravityArgs);
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
 *
 * @param {Object} props Same as doJumpDown (setCharacterStatus, jumpRef, elevationRef, elsRef).
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
 * Check if we're frozen (e.g. a milestone is visible or we're in the middle of a jump).
 * 
 * This allows us to disable keyboard controls temporarily.
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
	} = props;

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
				// Toggle running
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

				// Move forward
				if (e.key === 'ArrowRight') {
					e.preventDefault();
					if (isFrozen()) return;
					doRun({ direction: 'forward', timelines: timelinesRef.current, setCharacterStatus });
				}

				// Move backwards
				if (e.key === 'ArrowLeft') {
					e.preventDefault();
					if (isFrozen()) return;
					doRun({ direction: 'backward', timelines: timelinesRef.current, setCharacterStatus });
				}
			}
		};

		// Pause movement when key is released
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
