import { useEffect } from 'react';
import { useGameplayContext, useLevelContext } from '../context/useContexts';

/**
 * Sets up board element refs from the level SVG: shelves, obstacles, character, etc.
 */
export function useSetupGameplayElements(boardRef) {
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
		// Identify as negative/positive
		elObstacles.forEach((obstacle) => {
			if (obstacle.dataset?.score?.startsWith('-')) {
				obstacle.classList.add('is-negative');
			} else if (obstacle.dataset.score) {
				obstacle.classList.add('is-positive');
			} else {
				obstacle.classList.add('is-neutral');
			}
		});
		// Update context with both
		const newState = {
			// fixed els (don't change per level)
			elBoard,
			elCharacter: elBoard?.nextElementSibling,
			elCharacterCrashArea: elBoard?.nextElementSibling?.querySelector('.sr-character-crash'),
			// dynamic els (change per level)
			elShelves: Array.from(elShelves),
			elObstacles,
		};
		elsRef.current = { ...elsRef.current, ...newState };
	}, [boardRef, elsRef, currentLevelId, elevationRef]);

	// Track which shelves and obstacles are visible
	useEffect(() => {
		const shelves = elsRef.current?.elShelves ?? [];
		const obstacles = elsRef.current?.elObstacles ?? [];
		const elShelvesVisible = elsRef.current.elShelvesVisible;
		const elObstaclesVisible = elsRef.current.elObstaclesVisible;
		elShelvesVisible.clear();
		elObstaclesVisible.clear();

		const options = {
			root: null,
			rootMargin: '0px 100px 0px 100px', // 100px left/right, 0 top/bottom
			threshold: 0,
		};

		const shelvesObserver = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) elShelvesVisible.add(entry.target);
					else elShelvesVisible.delete(entry.target);
				}
			},
			options,
		);
		const obstaclesObserver = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) elObstaclesVisible.add(entry.target);
					else elObstaclesVisible.delete(entry.target);
				}
			},
			options,
		);

		shelves.forEach((el) => shelvesObserver.observe(el));
		obstacles.forEach((el) => obstaclesObserver.observe(el));
		return () => {
			shelves.forEach((el) => shelvesObserver.unobserve(el));
			obstacles.forEach((el) => obstaclesObserver.unobserve(el));
			elShelvesVisible.clear();
			elObstaclesVisible.clear();
		};
	}, [elsRef, currentLevelId]);

}
