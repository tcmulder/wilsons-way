import { doScoring, doModifiers, doMilestones } from './doCrash';

/**
 * Check to see if two elements overlap
 *
 * @param {HTMLElement} el1 First element to check
 * @param {HTMLElement} el2 Second element to check
 * @return {boolean} Whether or not the elements overlap
 */
const checkOverlap = (el1, el2) => {
	const rect1 = el1.getBoundingClientRect();
	const rect2 = el2.getBoundingClientRect();
	return (
		rect1.left < rect2.right &&
		rect1.right > rect2.left &&
		rect1.top < rect2.bottom &&
		rect1.bottom > rect2.top
	);
};

/**
 * Get the nearest elements above and below an element in a single pass.
 *
 * @param {HTMLElement}   el  Element to look from (e.g. character)
 * @param {HTMLElement[]} els Elements to check (e.g. shelves)
 * @return {{ elAbove: HTMLElement|null, elBelow: HTMLElement|null }}
 */
export const getNearestShelves = (el, els) => {
	const charRect = el.getBoundingClientRect();
	let elAbove = null;
	let elBelow = null;

	for (const shelf of els) {
		const shelfRect = shelf.getBoundingClientRect();

		// Bail if the shelf doesn't align left to right
		if (!(shelfRect.left < charRect.right && shelfRect.right > charRect.left)) {
			continue;
		}

		// Fudge a bit (otherwise character falls through shelves if falling too fast)
		const fudge = charRect.height * 0.25;

		// Get the shelf above the character
		if (shelfRect.bottom <= charRect.top + fudge) {
			if (!elAbove || shelfRect.bottom > elAbove.getBoundingClientRect().bottom) {
				elAbove = shelf;
			}
		}

		// Get shelf below the character
		if (shelfRect.top >= charRect.bottom - fudge) {
			if (!elBelow || shelfRect.top < elBelow.getBoundingClientRect().top) {
				elBelow = shelf;
			}
		}
	}

	// Default to the last shelf (the sidewalk)
	if (elBelow === null && els.length > 0) {
		elBelow = els.at(-1);
	}

	return { elAbove, elBelow };
};

/**
 * Check for and respond to collisions.
 *
 * @param {Object} props The properties object
 * @param {Object} props.els The elements object
 * @param {Function} props.setScore Function to set the score
 * @param {number} props.level The current level number
 * @param {string[]} props.characterModifiers The current character modifiers
 * @param {Function} [props.playSound] Function to play a sound ('positive' | 'negative')
 * @param {Function} props.setCharacterModifiers Function to set the character modifiers
 */
export const checkCollisions = (props) => {
	const { els, setScore, level, characterModifiers, playSound, setCharacterModifiers } = props;
	const { elCharacterCrashArea, elCharacterMessage, elObstaclesVisible } = els;
	elObstaclesVisible.forEach((el) => {
		if (
			!el.classList.contains('is-collided') &&
			checkOverlap(elCharacterCrashArea, el)
		) {
			doModifiers({
				el,
				characterModifiers,
				setCharacterModifiers,
			});
			doScoring({
				el,
				elCharacterMessage,
				setScore,
				level,
				characterModifiers,
				playSound,
			});
			doMilestones(el);
		}
	});
};

/**
 * Update elevation ref with character/shelf positions.
 *
 * @param {Object} els Element refs: elCharacter, elShelvesVisible, elBoard
 * @param {Object} elevationRef Ref to update with above, below, head, foot, floor, etc.
 */
export const checkElevation = (els, elevationRef) => {
	const { elCharacter, elShelvesVisible, elBoard } = els;
	const elBoardRect = elBoard.getBoundingClientRect();
	const elCharacterRect = elCharacter.getBoundingClientRect();
	const { elAbove, elBelow } = getNearestShelves(elCharacter, elShelvesVisible);
	const localElevation = {
		above: 0,
		below: 0,
		charBelow: 0,
	};
	if (elAbove) {
		localElevation.above = Math.round(elBoardRect.height - elAbove.getBoundingClientRect().bottom);
	} else {
		localElevation.above = Math.round(elBoardRect.height);
	}
	if (elBelow) {
		localElevation.below = Math.round(elBoardRect.height - elBelow.getBoundingClientRect().top);
	}
	localElevation.head = Math.round(elBoardRect.height - elCharacterRect.top);
	localElevation.foot = Math.round(elBoardRect.height - elCharacterRect.bottom);
	elevationRef.current = { ...elevationRef.current, ...localElevation };
};
