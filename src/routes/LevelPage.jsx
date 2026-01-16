import { useRef, useCallback, useEffect } from 'react';
import { useGameContext } from '../context/useGameContext';
import { loadLevel } from '../util/loadLevel';
import { allowDrop } from '../util/loadLevel';
import SVG from '../components/SVG';
import Character from '../components/Character';

import '../css/board.css';
import '../css/parallax.css';


const GameplayPage = () => {
	const { debug, level, setTimelines, settings: { difficultySpeed } } = useGameContext();
	const boardRef = useRef(null);

	const handleSvgLoad = useCallback(async (svgElement) => {
		if (boardRef.current && svgElement) {
			await loadLevel(boardRef.current, svgElement, setTimelines, difficultySpeed);
		}
	}, [setTimelines, difficultySpeed]);

	useEffect(() => {
		if (boardRef.current) {
			return allowDrop(boardRef.current, debug, setTimelines, difficultySpeed);
		}
	}, [setTimelines, difficultySpeed]);

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