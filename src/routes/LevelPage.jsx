import { useRef, useCallback, useEffect, useState } from 'react';
import { useDebugContext, useSettingsContext, useLevelContext, useSetTimelinesContext } from '../context/useContexts';
import { loadLevel } from '../util/loadLevel';
import { allowDrop } from '../util/loadLevel';
import SVG from '../components/SVG';
import Character from '../components/Character';
import CollisionTracker from '../components/CollisionTracker';
import { addInteractivity } from '../util/addInteractivity';
import { aniLevel } from '../util/aniLevel';

import '../css/board.css';
import '../css/parallax.css';


const GameplayPage = () => {
	const { debug } = useDebugContext();
	const { settings } = useSettingsContext();
	const { level } = useLevelContext();
	const { setTimelines } = useSetTimelinesContext();
	const difficultySpeed = settings.difficultySpeed;
	const boardRef = useRef(null);

	const [levelState, setLevelState] = useState({
		elBoard: boardRef.current,
		elCharacter: null,
		elCharacterCrashArea: null,
		elShelves: [],
		elObstacles: [],
		elObstaclesNegative: [],
		collided: new Set(),
		isEnded: false,
	});

	const handleSvgLoad = useCallback(async (svgElement) => {
		if (boardRef.current && svgElement) {
			// Setup level SVG
			await loadLevel({
				elBoard: boardRef.current,
				elSVG: svgElement,
			});
			// Create animation after level is loaded
			aniLevel({
				elBoard: boardRef.current,
				setTimelines,
				difficultySpeed,
			});
			// // Setup level interactivity
			// addInteractivity({
			// 	elBoard: boardRef.current,
			// 	levelState,
			// 	setLevelState,
			// });
		}
	}, [setTimelines, difficultySpeed]);

	useEffect(() => {
		if (boardRef.current) {
			return allowDrop({
				elBoard: boardRef.current,
				debug,
				setTimelines,
				difficultySpeed,
				levelState,
				setLevelState,
			});
		}
	}, [debug, setTimelines, difficultySpeed]);

	return (
		<>
			<CollisionTracker boardRef={boardRef} />
			<div className="sr-board" ref={boardRef}>
				<SVG 
					path={`${window.sr.url}public/svg/level-${level}.svg`} 
					onSvgLoad={handleSvgLoad}
				/>
			</div>
			<Character />
		</>
	);
};

export default GameplayPage;