import { useEffect } from 'react';
import { useGameplayContext, useLevelContext } from '../context/useContexts';

/**
 * Sets up board element refs from the level SVG: shelves, obstacles, character, crash area, etc.
 *
 * @param {React.RefObject<HTMLElement>} boardRef Ref to the gameplay wrapper
 */
export function useSetupGameplayElements(boardRef) {
	const { elsRef, elevationRef } = useGameplayContext();
	const { currentLevelId } = useLevelContext();

	// Get elements from the new level SVG and configure them for use
	useEffect(() => {
		// Get the board where the level SVG shown
		if (!boardRef?.current) return;
		const elBoard = boardRef.current.querySelector('.sr-board');
		// Elevated shelves we can jump on/off plus the ground floor
		const elShelves = elBoard
			.querySelectorAll('.sr-shelves > *') || [];
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
		// Get and setup milestones
		elBoard
			.querySelectorAll('.sr-milestones')
			?.forEach((elMilestones) => {
				elMilestones.querySelectorAll('.sr-milestone-target').forEach((elMilestoneTarget) => {
					// Set the delay (set by parent, or milestone itself, with a fallback of 500ms)
					const delay =
						Number(elMilestoneTarget.dataset.delay || elMilestones.dataset.delay || '5000');
					elMilestoneTarget.dataset.delay = String(delay);
					elObstacles.push(elMilestoneTarget);
				});
			});
		// Identify as negative/positive/neutral
		elObstacles.forEach((obstacle) => {
			if (obstacle.dataset?.score?.startsWith('-')) {
				obstacle.classList.add('is-negative');
			} else if (obstacle.dataset.score) {
				obstacle.classList.add('is-positive');
			} else {
				obstacle.classList.add('is-neutral');
			}
		});
		// Handle random obstacles
		const elRandomObstacles = elObstacles.filter(obstacle => obstacle.dataset?.rand);
		if (elRandomObstacles.length) {
			const groups = {};
			elRandomObstacles.forEach((el) => {
				const group = el.dataset.rand;
				if (!groups[group]) {
					groups[group] = [];
				}
				groups[group].push(el);
			});
			Object.values(groups).forEach((group) => {
				const rand = Math.floor(Math.random() * group.length);
				group.forEach((el, index) => {
					if (index !== rand) {
						el.style.display = 'none';
					} else {
						el.style.display = 'block';
					}
				});
			});
		}

		// Update context with both
		const elCharacter = elBoard?.nextElementSibling;
		// Create our new state object
		const newState = {
			// fixed els (don't change per level)
			elBoard,
			elCharacter,
			elCharacterCrashArea: elCharacter?.querySelector('.sr-character-crash'),
			elCharacterMessage: elCharacter?.querySelector('.sr-character-message'),
			// dynamic els (change per level)
			elShelves: Array.from(elShelves),
			elObstacles,
		};
		elsRef.current = { ...elsRef.current, ...newState };
	}, [boardRef, elsRef, currentLevelId, elevationRef]);

	// Track which shelves and obstacles are visible
	useEffect(() => {
		const shelves = elsRef.current?.elShelves ?? [];
		
		// Bail if we have no shelves
		if (!shelves.length) return;
		
		// Get obstacles
		const obstacles = elsRef.current?.elObstacles ?? [];
		const elShelvesVisible = elsRef.current.elShelvesVisible;
		const elObstaclesVisible = elsRef.current.elObstaclesVisible;
		elShelvesVisible.clear();
		elObstaclesVisible.clear();

		// Setup obstacles intersection observer
		const options = { root: null, rootMargin: '0px 100px 0px 100px', threshold: 0.01 };
		const obstaclesObserver = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) elObstaclesVisible.add(entry.target);
					else elObstaclesVisible.delete(entry.target);
				}
			},
			options,
		);
		obstacles.forEach((el) => obstaclesObserver.observe(el));

		// Setup shelves intersection observer
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

		// Cleanup
		return () => {
			shelves.forEach((el) => shelvesObserver.unobserve(el));
			obstacles.forEach((el) => obstaclesObserver.unobserve(el));
			elShelvesVisible.clear();
			elObstaclesVisible.clear();
		};
	}, [elsRef, currentLevelId]);

}
