import { useRef, useCallback, useEffect } from 'react';
import { useDebugContext, useSettingsContext, useLevelContext, useGameplayContext } from '../context/useContexts';
import { loadLevel } from '../util/loadLevel';
import { allowDrop } from '../util/loadLevel';
import SVG from '../components/SVG';
import Character from '../components/Character';
import Gameplay from '../components/Gameplay';
import { aniLevel } from '../util/aniLevel';
import { trackMovement } from '../util/doMovement';

import '../css/board.css';
import '../css/parallax.css';


const GameplayPage = () => {
	const { debug } = useDebugContext();
	const { settings } = useSettingsContext();
	const { level, setCurrentLevelId } = useLevelContext();
	const gameplayContext = useGameplayContext();
	const difficultySpeed = settings.difficultySpeed * 0.75;
	const gameplayRef = useRef(null);

	const handleSvgLoad = useCallback(async (svgElement) => {
		if (gameplayContext.elsRef.current.elBoard && svgElement) {
			// Setup level SVG
			await loadLevel({
				elBoard: gameplayContext.elsRef.current.elBoard,
				elSVG: svgElement,
			});
			// Create animation after level is loaded
			aniLevel({
				elBoard: gameplayContext.elsRef.current.elBoard,
				setTimelines: (timelines) => { gameplayContext.timelinesRef.current = timelines; },
				difficultySpeed,
				onTimelineUpdate: () => trackMovement(gameplayContext),
			});
			setCurrentLevelId(Date.now());
		}
	}, [difficultySpeed, setCurrentLevelId, gameplayContext]);

	useEffect(() => {
		if (gameplayContext.elsRef.current.elBoard) {
			return allowDrop({
				elBoard: gameplayContext.elsRef.current.elBoard,
				debug,
				setTimelines: (timelines) => { gameplayContext.timelinesRef.current = timelines; },
				difficultySpeed,
				onTimelineUpdate: () => trackMovement(gameplayContext),
				onLevelLoaded: () => setCurrentLevelId(Date.now()),
			});
		}
	}, [debug, difficultySpeed, setCurrentLevelId, gameplayContext]);
	
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