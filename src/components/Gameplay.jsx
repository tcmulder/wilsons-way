import { gsap } from 'gsap';
import { useEffect } from 'react';
import { throttle } from 'underscore';
import { useGameplayContext, useLevelContext, useSettingsContext } from '../context/useContexts';

const CollisionTracker = ({ boardRef }) => {
	const { elsRef, elevationRef, jumpRef } = useGameplayContext();
	const { currentLevelId } = useLevelContext();
	const { jump } = useSettingsContext();

	// Setup elements.
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
	}, [boardRef, elsRef, currentLevelId, elevationRef]);

	// Setup elevations and jump.
	useEffect(() => {
		if (!elsRef?.current?.elBoard || !elsRef?.current?.elCharacter || !elsRef?.current?.elShelves?.at(-1)) return;
		const updateElevations = () => {
			const elBoardRect = elsRef.current.elBoard.getBoundingClientRect();
			const elFloorRect = elsRef.current.elShelves.filter(el => el.classList.contains('sr-sidewalk'))[0].getBoundingClientRect();
			elevationRef.current = {
				...elevationRef.current,
				ceiling: Math.round(elBoardRect.height),
				floor: Math.round(elBoardRect.height - elFloorRect.top),
			};
			jumpRef.current = {
				height: Math.round(elBoardRect.height * jump.height),
				hangtime: jump.hangtime,
			};
			gsap.set(elsRef.current.elCharacter, { y: elevationRef.current.floor * -1 });
		};
		const throttledUpdate = throttle(updateElevations, 250);
		updateElevations();
		const observer = new ResizeObserver(throttledUpdate);
		observer.observe(elsRef.current.elBoard);
		return () => {
			observer.disconnect();
			throttledUpdate.cancel();
		};
	}, [currentLevelId, elsRef, elevationRef, jumpRef, jump]);


	return null;
};

export default CollisionTracker;