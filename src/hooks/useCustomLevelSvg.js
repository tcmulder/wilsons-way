import { useEffect } from 'react';

import { aniLevel } from '../util/aniLevel';
import { convertClassToData } from '../util/convertClassToData';
import { loadLevel } from '../util/loadLevel';

/**
 * When using a custom dropped SVG (level 0), load and animate it.
 *
 * @param {Object} props
 * @param {number} props.level Current level number
 * @param {string|null} props.customLevelSvg Raw SVG text for the custom level
 * @param {Object} props.gameplayContext Gameplay context (timelines, elsRef, etc.)
 * @param {number} props.gameplaySpeed Current gameplay speed
 * @param {Function} props.setLevelProgress Setter for level progress
 * @param {() => void} props.handleLevelComplete Callback when level completes
 * @param {Function} props.setCurrentLevelId Setter for currentLevelId
 */
export function useCustomLevelSvg(props) {
	const {
		level,
		customLevelSvg,
		gameplayContext,
		gameplaySpeed,
		setLevelProgress,
		handleLevelComplete,
		setCurrentLevelId,
	} = props;

	useEffect(() => {
		if (level !== 0 || !customLevelSvg) return;

		const ctx = gameplayContext;
		const elBoard = ctx.elsRef?.current?.elBoard;
		if (!elBoard) return;

		// Mark level as "not yet loaded" while we process the custom SVG
		setCurrentLevelId(null);

		const parser = new DOMParser();
		const doc = parser.parseFromString(customLevelSvg, 'image/svg+xml');
		const elSVG = doc.documentElement;
		if (!elSVG) return;

		convertClassToData(elSVG);

		(async () => {
			await loadLevel({
				elBoard,
				elSVG,
			});
			aniLevel({
				elBoard,
				timelinesRef: ctx.timelinesRef,
				setTimelines: (timelines) => { ctx.timelinesRef.current = timelines; },
				setLevelProgress,
				gameplaySpeed,
				onComplete: handleLevelComplete,
			});
			setCurrentLevelId(Date.now());
		})();
	}, [
		level,
		customLevelSvg,
		gameplayContext,
		gameplaySpeed,
		setLevelProgress,
		handleLevelComplete,
		setCurrentLevelId,
	]);
}

