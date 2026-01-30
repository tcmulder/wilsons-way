import { useRef, useCallback, useEffect, useState } from 'react';
import { useDebugContext, useSettingsContext, useLevelContext, useSetTimelinesContext, useElsContext } from '../context/useContexts';
import { loadLevel } from '../util/loadLevel';
import { allowDrop } from '../util/loadLevel';
import SVG from '../components/SVG';
import Character from '../components/Character';
import CollisionTracker from '../components/CollisionTracker';
import { aniLevel } from '../util/aniLevel';

import '../css/board.css';
import '../css/parallax.css';


const GameplayPage = () => {
	const { debug } = useDebugContext();
	const { settings } = useSettingsContext();
	const { level } = useLevelContext();
	const { setTimelines } = useSetTimelinesContext();
	const { els } = useElsContext();
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
		if (els.elBoard && svgElement) {
			// Setup level SVG
			await loadLevel({
				elBoard: els.elBoard,
				elSVG: svgElement,
			});
			// Create animation after level is loaded
			aniLevel({
				elBoard: els.elBoard,
				setTimelines,
				difficultySpeed,
			});
		}
	}, [els.elBoard, setTimelines, difficultySpeed]);

	useEffect(() => {
		if (els.elBoard) {
			return allowDrop({
				elBoard: els.elBoard,
				debug,
				setTimelines,
				difficultySpeed,
				levelState,
				setLevelState,
			});
		}
	}, [els.elBoard, debug, setTimelines, difficultySpeed, levelState, setLevelState]);

	console.log('DEBUG: rerendered');
	
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