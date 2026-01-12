import { state, setCharacterState } from './state';
import { getNearest, isTimelineEnd, isTimelineStart } from './utilities';
import { ani } from './animation';

/**
 * Run forward
 */
export const doRun = () => {
	// Bail if paused
	if (state.status.pause === 'paused') {
		return;
	}
	// Bail if we're already at the end of the timeline)
	if (isTimelineEnd()) {
		return;
	}

	setCharacterState({ move: 'forward' });
	ani('play');
};

/**
 * Run backward
 */
export const doBackslide = () => {
	// Bail if paused
	if (state.status.pause === 'paused') {
		return;
	}
	// Bail if we're at the start of the timeline
	if (isTimelineStart()) {
		return;
	}

	setCharacterState({ move: 'backward' });
	ani('backslide');
};

/**
 * Stop running
 */
export const doStop = () => {
	setCharacterState({ move: 'none' });
	ani('pause');
};

/**
 * Pause or resume the game (e.g. you can freeze mid-jump)
 *
 * @param {boolean} shouldPause Whether to pause (true) or resume (false)
 */
export const doPause = (shouldPause = true) => {
	if (shouldPause) {
		// Start pause
		setCharacterState({ pause: 'paused' });
		doStop();
		// Freeze the character in place (in case we're in a jump)
		const computedStyle = window.getComputedStyle(state.elCharacter);
		const matrix = new DOMMatrix(computedStyle.transform);
		state.elCharacter.style.setProperty('--sr-freeze', `${matrix.m42}px`);
	} else {
		// Stop pausing
		state.elCharacter.style.setProperty('--sr-freeze', '');
		setCharacterState({ pause: 'none' });
		doRun();
	}
};

/**
 * Send character down from a jump and then land
 */
const doJumpDown = () => {
	const { hangtime } = state;
	setCharacterState({ jump: 'down' });
	setTimeout(() => {
		setCharacterState({ jump: 'none' });
	}, hangtime);
};

/**
 * Move character up in a jump
 */
const doJumpUp = () => {
	const { status, hangtime } = state;
	if (status.pause === 'paused') {
		return;
	}
	setCharacterState({ jump: 'up' });
	// Start downward journey once we've hit the peak
	setTimeout(() => {
		doJumpDown();
	}, hangtime);
};

/**
 * Coordinate jumping
 */
export const doJump = () => {
	const { elCharacter, elShelves, status, elStage } = state;
	if (status.jump === 'none') {
		// Don't bump our heads on a shelf that's above us
		const shelfAbove = getNearest(elCharacter, elShelves, 'above');
		if (shelfAbove) {
			const stageRect = elStage.getBoundingClientRect();
			const shelfRect = shelfAbove.getBoundingClientRect();
			const charRect = elCharacter.getBoundingClientRect();
			const h =
				((stageRect.bottom - shelfRect.bottom) / stageRect.height) * 100 -
				(charRect.height / stageRect.height) * 100;
			elCharacter.style.setProperty('--sr-h-shelf-above', `${h}cqh`);
		} else {
			// If there's no shelf above us we can jump all the way up
			elCharacter.style.setProperty('--sr-h-shelf-above', '99cqh');
		}
		// Start upward journey
		doJumpUp();
	}
};
