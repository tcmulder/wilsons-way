import { useRef, useCallback, useEffect } from 'react';
import { useDebugContext, useSettingsContext, useLevelContext, useGameplayContext } from '../context/useContexts';
import { loadLevel } from '../util/loadLevel';
import { allowDrop } from '../util/loadLevel';
import SVG from '../components/SVG';
import Character from '../components/Character';
import Gameplay from '../components/Gameplay';
import { aniLevel } from '../util/aniLevel';

import '../css/board.css';
import '../css/parallax.css';


const GameplayPage = () => {
	const { debug } = useDebugContext();
	const { settings } = useSettingsContext();
	const { level, setCurrentLevelId } = useLevelContext();
	const { timelinesRef, elsRef } = useGameplayContext();
	const difficultySpeed = settings.difficultySpeed * 0.75;
	const gameplayRef = useRef(null);

	const handleSvgLoad = useCallback(async (svgElement) => {
		if (elsRef.current.elBoard && svgElement) {
			// Setup level SVG
			await loadLevel({
				elBoard: elsRef.current.elBoard,
				elSVG: svgElement,
			});
			// Create animation after level is loaded
			aniLevel({
				elBoard: elsRef.current.elBoard,
				setTimelines: (timelines) => { timelinesRef.current = timelines; },
				difficultySpeed,
			});
			setCurrentLevelId(Date.now());
		}
	}, [elsRef, timelinesRef, difficultySpeed, setCurrentLevelId]);

	useEffect(() => {
		if (elsRef.current.elBoard) {
			return allowDrop({
				elBoard: elsRef.current.elBoard,
				debug,
				setTimelines: (timelines) => { timelinesRef.current = timelines; },
				difficultySpeed,
				onLevelLoaded: () => setCurrentLevelId(Date.now()),
			});
		}
	}, [elsRef, debug, timelinesRef, difficultySpeed, setCurrentLevelId]);
	
	return (
		<div className="sr-gameplay" ref={gameplayRef}>
			<Gameplay boardRef={gameplayRef} />
			<div className="sr-board">
				<SVG 
					path={`${window.sr.url}public/svg/level-${level}.svg`} 
					onSvgLoad={handleSvgLoad}
				/>
			</div>
			<Character />
		</div>
	);
};

export default GameplayPage;