import { gsap } from 'gsap';
import { useEffect } from 'react';
import { throttle } from 'underscore';
import { useGameplayContext, useLevelContext, useSettingsContext } from '../context/useContexts';

/**
 * Sets elevationRef (ceiling, floor) and jumpRef (height, hangtime) from board/sidewalk, and syncs character Y on resize.
 */
export function useSetupGameplayElevations() {
	const { elsRef, elevationRef, jumpRef } = useGameplayContext();
	const { jump } = useSettingsContext();
	const { currentLevelId } = useLevelContext();

	// Set the elevations and jump values when the component mounts
	useEffect(() => {
		if (!elsRef?.current?.elBoard || !elsRef?.current?.elCharacter || !elsRef?.current?.elShelves?.length) return;
		const updateElevations = () => {
			const elBoardRect = elsRef.current.elBoard.getBoundingClientRect();
			const elFloorRect = elsRef.current.elShelves.find(el => el.hasAttribute('data-floor'))?.getBoundingClientRect();
			if(!elBoardRect.height || !elFloorRect.top) return;
			const boardTop = elBoardRect.top;
			const boardHeight = elBoardRect.height;
			const floorTopWithinBoard = elFloorRect.top - boardTop;
			elevationRef.current = {
				...elevationRef.current,
				ceiling: Math.round(boardHeight),
				floor: Math.round(boardHeight - floorTopWithinBoard),
			};
			jumpRef.current = {
				height: Math.round(boardHeight * jump.height),
				hangtime: jump.hangtime,
			};
			// Start our character off on the floor
			gsap.set(elsRef.current.elCharacter, { y: elevationRef.current.floor * -1 });
		};
		const throttledUpdate = throttle(updateElevations, 250);
		updateElevations();
		
		// Observe the board with ResizeObserver so values stay correct when the window or container resizes.
		const observer = new ResizeObserver(throttledUpdate);
		observer.observe(elsRef.current.elBoard);
		return () => {
			observer.disconnect();
			throttledUpdate.cancel();
		};
	}, [currentLevelId, elsRef, elevationRef, jumpRef, jump]);
}
