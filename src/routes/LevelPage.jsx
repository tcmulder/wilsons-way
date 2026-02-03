import { useRef, useCallback, useEffect } from 'react';
import { useDebugContext, useSettingsContext, useLevelContext, useGameplayContext } from '../context/useContexts';
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
	const { level, setCurrentLevelId } = useLevelContext();
	const { setTimelinesStable, els } = useGameplayContext();
	const { setTimelines } = setTimelinesStable;
	const difficultySpeed = settings.difficultySpeed;
	const boardRef = useRef(null);

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
			setCurrentLevelId(Date.now());
		}
	}, [els.elBoard, setTimelines, difficultySpeed, setCurrentLevelId]);

	useEffect(() => {
		if (els.elBoard) {
			return allowDrop({
				elBoard: els.elBoard,
				debug,
				setTimelines,
				difficultySpeed,
				onLevelLoaded: () => setCurrentLevelId(Date.now()),
			});
		}
	}, [els.elBoard, debug, setTimelines, difficultySpeed, setCurrentLevelId]);

	console.log('DEBUG: rerendered', els);
	
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