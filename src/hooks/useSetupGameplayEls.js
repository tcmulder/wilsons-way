import { useEffect } from 'react';

import { useGameplayContext, useLevelContext } from '../context/useContexts';
import {
	getShelves,
	getObstacles,
	setupMilestones,
	handleRandomObstacles,
	getCharacter,
} from '../util/loadLevel';

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
		// Get the board where the level SVG is shown
		if (!boardRef?.current) return;
		const elBoard = boardRef.current.querySelector('.sr-board');

		// Get shelves (layers you can jump on/off)
		const elShelves = getShelves(elBoard);
		// Get the obstacles (pos/neg items you can collide with)
		const elObstacles = getObstacles(elBoard);
		// Setup milestones (some obstacles show messages when hit)
		setupMilestones(elBoard);
		// Hide all but one item from random obstacles groups
		handleRandomObstacles(elObstacles);
		// Get the character's element
		const elCharacter = getCharacter(elBoard);
		// Create our new state object
		const newState = {
			// fixed els (don't change per level)
			elBoard,
			elCharacter,
			elCharacterCrashArea: elCharacter?.querySelector('.sr-character-crash'),
			elCharacterMessage: elCharacter?.querySelector('.sr-character-message'),
			// dynamic els (change per level)
			elShelves,
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
