import { useEffect } from 'react';
import { useGameplayContext, useLevelContext } from '../context/useContexts';
import { trackCollisions } from '../util/handleCollisions';

const CollisionTracker = ({ boardRef }) => {
	const { elsRef, elevationRef } = useGameplayContext();
	const { currentLevelId } = useLevelContext();

	useEffect(() => {
		if (!boardRef?.current) return;
		const elBoard = boardRef.current.querySelector('.sr-board');
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
		// Update context with both
		const newState = {
			// fixed els (don't change per level)
			elBoard,
			elCharacter: elBoard?.nextElementSibling,
			elCharacterCrashArea: elBoard?.nextElementSibling?.querySelector('.sr-character-crash'),
			// dynamic els (change per level)
			elShelves: Array.from(elShelves),
			elObstacles,
			elObstaclesNegative,
		};
		elsRef.current = { ...elsRef.current, ...newState };
		const stopTrack = trackCollisions({elsRef, elevationRef});
		return () => {
			stopTrack();
		};
	}, [boardRef, elsRef, currentLevelId, elevationRef]);

	return null;
};

export default CollisionTracker;