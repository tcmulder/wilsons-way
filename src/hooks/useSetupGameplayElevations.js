import { gsap } from 'gsap';
import { useEffect } from 'react';
import { throttle } from 'underscore';
import { useGameplayContext, useLevelContext, useSettingsContext } from '../context/useContexts';

/**
 * Sets elevationRef (ceiling, floor) and jumpRef (height, hangtime) from board/sidewalk, and syncs character Y on resize.
 * Observes the board with ResizeObserver so values stay correct when the window or container resizes.
 */
export function useSetupGameplayElevations() {
	const { elsRef, elevationRef, jumpRef } = useGameplayContext();
	const { jump } = useSettingsContext();
	const { currentLevelId } = useLevelContext();

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
}
