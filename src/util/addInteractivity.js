import { trackCollisions } from './handleCollisions';

/**
 * Add interactivity to the level
 *
 * @param {Object} props The properties object
 * @param {HTMLElement} props.elBoard The board DOM element
 * @param {Object} props.levelState The level state object
 * @param {Function} props.setLevelState Function to set level state
 */
export const addInteractivity = ({elBoard, levelState, setLevelState}) => {
	if (!elBoard) return;

	/**
	 * Get elements from the new level SVG
	 */
	// Elevated shelves we can jump on/off plus the ground floor
	const elShelves = elBoard
		.querySelector('.sr-shelves')
		?.querySelectorAll(':scope > *') || [];
	
	// All obstacles (good bad or neutral)
	const elObstacles = [];
	// Add all obstacles that score on impact (good or bad)
	elBoard
		.querySelectorAll('.sr-obstacles[data-score]')
		?.forEach((elObstacle) => {
			elObstacle.querySelectorAll(':scope > *').forEach((elChild) => {
				if (!elChild.hasAttribute('data-score')) {
					elChild.dataset.score = elObstacle.dataset.score;
				}
				elObstacles.push(elChild);
			});
		});
	// Add all milestone obstacles we can impact
	elBoard
		.querySelectorAll('.sr-milestone-target')
		?.forEach((elMilestone) => {
			elObstacles.push(elMilestone);
		});
	// Create filtered list of all negative obstacles (those with a negative score)
	const elObstaclesNegative = [...elObstacles].filter(
		(obstacle) =>
			obstacle.dataset.score && obstacle.dataset.score.startsWith('-'),
	);

	// Build updated state object
	const updatedState = {
		...levelState,
		elBoard: elBoard,
		elCharacter: elBoard?.nextElementSibling,
		elCharacterCrashArea: elBoard?.nextElementSibling?.querySelector('.sr-character-crash'),
		elShelves: Array.from(elShelves),
		elObstacles: elObstacles,
		elObstaclesNegative: elObstaclesNegative,
	};

	// Update state
	setLevelState(updatedState);

	// Track collisions with the updated state and setter
	trackCollisions(updatedState, setLevelState);
};