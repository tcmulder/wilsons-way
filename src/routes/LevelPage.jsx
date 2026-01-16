import { useRef, useCallback, useEffect, useState } from 'react';
import { useGameContext } from '../context/useGameContext';
import { loadLevel } from '../util/loadLevel';
import { allowDrop } from '../util/loadLevel';
import SVG from '../components/SVG';
import Character from '../components/Character';
import { addInteractivity } from '../util/addInteractivity';
import { aniLevel } from '../util/aniLevel';

import '../css/board.css';
import '../css/parallax.css';


const GameplayPage = () => {
	const { debug, level, setTimelines, settings: { difficultySpeed } } = useGameContext();
	const boardRef = useRef(null);

	const [levelState, setLevelState] = useState({
		elBoard: boardRef.current,
		elCharacter: null,
		elCharacterCrashArea: null,
		elShelves: [],
		elObstacles: [],
		elObstaclesNegative: [],
		collided: new Set(),
		status: { move: 'forward', jump: 'none', pause: 'none' },
		isEnded: false,
	});

	const handleSvgLoad = useCallback(async (svgElement) => {
		if (boardRef.current && svgElement) {
			// Setup level SVG
			await loadLevel({
				elBoard: boardRef.current,
				elSVG: svgElement,
				setTimelines,
				difficultySpeed,
				levelState,
				setLevelState,
			});
			// Create animation after level is loaded
			aniLevel({
				elBoard: boardRef.current,
				setTimelines,
				difficultySpeed,
			});
			// Setup level interactivity
			addInteractivity({
				elBoard: boardRef.current,
				levelState,
				setLevelState,
			});
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