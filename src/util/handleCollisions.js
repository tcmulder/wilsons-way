import { doSound, doScoring, doTokens, doModifiers, doMilestones, doLives } from './doCrash';

/**
 * Check to see if two elements overlap
 *
 * @param {Object} props The properties object
 * @param {HTMLElement} props.el1 First element to check
 * @param {HTMLElement} props.el2 Second element to check
 * @return {boolean} Whether or not the elements overlap
 */
const checkOverlap = (props) => {
	const { el1, el2 } = props;
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
 * @param {Object} props.collisionArgs Props for checkCollisions (elsRef)
 * @param {Object} props.modifiersArgs Props for doModifiers (elsRef)
 * @param {Object} props.soundArgs Props for doSound (playSound)
 * @param {Object} props.scoringArgs Props for doScoring (setScore, level)
 * @param {Object} props.tokensArgs Props for doTokens (setTokens, level)
 * @param {Object} props.livesArgs Props for doLives (lives, setLives, setGameplayNavigation, debug)
 * @param {Object} props.milestonesArgs Props for doMilestones (userAdjustedMilestone)
 */
export const checkCollisions = (props) => {
	const {
		collisionArgs,
		modifiersArgs,
		soundArgs,
		scoringArgs,
		tokensArgs,
		livesArgs,
		milestonesArgs,
	} = props;
	const { elsRef } = collisionArgs;
	const els = elsRef?.current;
	const { elCharacterCrashArea, elObstaclesVisible } = els;
	elObstaclesVisible.forEach((el) => {
		if (
			!el.classList.contains('is-collided') &&
			checkOverlap({ el1: elCharacterCrashArea, el2: el })
		) {
			doModifiers({ el, ...modifiersArgs });
			doSound({ el, ...soundArgs });
			doScoring({ el, ...scoringArgs });
			doTokens({ el, ...tokensArgs });
			doLives({ el, ...livesArgs });
			doMilestones({ el, ...milestonesArgs });
		}
	});
};

/**
 * Update elevation ref with character/shelf positions.
 *
 * @param {Object} props The properties object
 * @param {Object} props.elsRef The elements ref object
 * @param {Object} elevationRef Ref to update with above, below, head, foot, floor, etc.
 */
export const checkElevation = (props) => {
	const { elsRef, elevationRef } = props;
	const els = elsRef?.current;
	const { elCharacter, elShelvesVisible, elBoard } = els;
	const { elAbove, elBelow } = getNearestShelves(elCharacter, elShelvesVisible);
	const elBoardRect = elBoard.getBoundingClientRect();
	const elCharacterRect = elCharacter.getBoundingClientRect();
	const boardTop = elBoardRect.top;
	const boardHeight = elBoardRect.height;
	const localElevation = { above: 0, below: 0, charBelow: 0 };
	if (elAbove) {
		const aboveBottom = elAbove.getBoundingClientRect().bottom - boardTop;
		localElevation.above = Math.round(boardHeight - aboveBottom);
	} else {
		localElevation.above = Infinity; // to have a ceiling set to Math.round(boardHeight);
	}
	if (elBelow) {
		const belowTop = elBelow.getBoundingClientRect().top - boardTop;
		localElevation.below = Math.round(boardHeight - belowTop);
	}
	const charTop = elCharacterRect.top - boardTop;
	const charBottom = elCharacterRect.bottom - boardTop;
	localElevation.head = Math.round(boardHeight - charTop);
	localElevation.foot = Math.round(boardHeight - charBottom);
	elevationRef.current = { ...elevationRef.current, ...localElevation };
};
