import { useEffect } from 'react';
import { useGameplayContext, useLevelContext } from '../context/useContexts';

/**
 * Sets up board element refs from the level SVG: shelves, obstacles, character, etc.
 *
 * @param {Object} boardRef React ref to the gameplay board container
 */
export function useSetupGameplayElements(boardRef) {
	const { elsRef, elevationRef } = useGameplayContext();
	const { currentLevelId } = useLevelContext();

	/**
	 * Get elements from the new level SVG and configure them for use
	 */
	useEffect(() => {
		// Get the board where the level SVG shown
		if (!boardRef?.current) return;
		const elBoard = boardRef.current.querySelector('.sr-board');
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
		// Setup milestones
		elBoard
			.querySelectorAll('.sr-milestones')
			?.forEach((elMilestones) => {
				elMilestones.querySelectorAll('.sr-milestone-target').forEach((elMilestoneTarget) => {
					const delay = elMilestoneTarget.dataset.delay || elMilestones.dataset.delay || '500';
					elMilestoneTarget.dataset.delay = delay;
					elObstacles.push(elMilestoneTarget);
				});
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
		const elCharacter = elBoard?.nextElementSibling;
		const newState = {
			// fixed els (don't change per level)
			elBoard,
			elCharacter,
			elCharacterCrashArea: elCharacter?.querySelector('.sr-character-crash'),
			elCharacterMessage: elCharacter?.querySelector('.sr-character-mesage'),
			// dynamic els (change per level)
			elShelves: Array.from(elShelves),
			elObstacles,
		};
		elsRef.current = { ...elsRef.current, ...newState };
	}, [boardRef, elsRef, currentLevelId, elevationRef]);

	// Track which shelves and obstacles are visible
	useEffect(() => {
		const shelves = elsRef.current?.elShelves ?? [];
		
		if (!shelves.length) return;
		
		const obstacles = elsRef.current?.elObstacles ?? [];
		const elShelvesVisible = elsRef.current.elShelvesVisible;
		const elObstaclesVisible = elsRef.current.elObstaclesVisible;
		elShelvesVisible.clear();
		elObstaclesVisible.clear();

		const options = {
			root: null,
			rootMargin: '0px 100px 0px 100px', // 100px left/right, 0 top/bottom
			threshold: 0.01,
		};
		const obstaclesObserver = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) elObstaclesVisible.add(entry.target);
					else elObstaclesVisible.delete(entry.target);
				}
			},
			options,
		);

		let firstRun = true;
		const shelvesObserver = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) elShelvesVisible.add(entry.target);
					else elShelvesVisible.delete(entry.target);
				}
				// After first observation, visible shelves is always >=1 when SVG paths trigger observers.
				// If we have shelves but none visible, the observer is broken (e.g. WebKit bug 196729 on SVG).
				// Run fallback so ALL shelves and obstacles are used to track collisions (albeit inefficiently).
				if (firstRun) {
					firstRun = false;
					if (shelves.length > 0 && elShelvesVisible.size === 0) {
						shelvesObserver.disconnect();
						obstaclesObserver.disconnect();
						shelves.forEach((x) => elShelvesVisible.add(x));
						obstacles.forEach((x) => elObstaclesVisible.add(x));
					}
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
