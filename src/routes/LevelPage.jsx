import { useRef, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import {
	useDebugContext,
	useSettingsContext,
	useLevelContext,
	useGameplayContext,
} from '../context/useContexts';
import { loadLevel } from '../util/loadLevel';
import { allowDrop } from '../util/loadLevel';
import SVG from '../components/SVG';
import Character from '../components/Character';
import Gameplay from '../components/Gameplay';
import { aniLevel } from '../util/aniLevel';

import '../css/board.css';
import '../css/parallax.css';
import '../css/obstacles.css';
import '../css/milestones.css';


const GameplayPage = () => {
	const { debug } = useDebugContext();
	const { settings } = useSettingsContext();
	const { gameplaySpeed, userAdjustedSpeed } = settings;
	const { level, setLevel, setCurrentLevelId, setIsLevelComplete, isLevelComplete } = useLevelContext();
	const gameplayContext = useGameplayContext();
	const gameplayRef = useRef(null);
	const navigate = useNavigate();

	// Set global animations speed
	useEffect(() => {
		gsap.globalTimeline.timeScale(userAdjustedSpeed / 50);
	}, [userAdjustedSpeed]);

	// Load SVG for level and add movement to it
	const handleSvgLoad = useCallback(async (svgElement) => {
		const ctx = gameplayContext;
		const elBoard = ctx.elsRef?.current?.elBoard;
		if (elBoard && svgElement) {
			// Setup level SVG
			await loadLevel({
				elBoard,
				elSVG: svgElement,
			});
			// Create animation after level is loaded
			aniLevel({
				elBoard,
				setTimelines: (timelines) => { ctx.timelinesRef.current = timelines; },
				gameplaySpeed,
				setIsLevelComplete,
			});
			setCurrentLevelId(Date.now());
		}
	}, [gameplaySpeed, setCurrentLevelId, gameplayContext, setIsLevelComplete]);

	// Allow drag-and-drop of SVG level files
	useEffect(() => {
		if (gameplayContext.elsRef.current.elBoard) {
			return allowDrop({
				elBoard: gameplayContext.elsRef.current.elBoard,
				debug,
				setTimelines: (timelines) => { gameplayContext.timelinesRef.current = timelines; },
				gameplaySpeed,
				onLevelLoaded: () => setCurrentLevelId(Date.now()),
				setLevel,
				setIsLevelComplete
			});
		}
	}, [debug, gameplaySpeed, setCurrentLevelId, gameplayContext, setLevel, setIsLevelComplete]);

	// Go to the outro page if the level is complete
	useEffect(() => {
		if (isLevelComplete) {
			navigate(`/outro/${level}`);
		}
	}, [isLevelComplete, level, navigate]);
	
	return (
		<div className="sr-gameplay" ref={gameplayRef}>
			<Gameplay boardRef={gameplayRef} />
			<div className="sr-board">
				{/* If level is 0, we're using a drag-and-dropped custom level, so don't load a numbered SVG file */}
				{level !== 0 && (
					<SVG 
						path={`${window.sr.url}public/svg/level-${level}.svg`} 
						onSvgLoad={handleSvgLoad}
					/>
				)}
			</div>
			<Character />
			<div className="sr-level-complete" style={{position: 'absolute', top: 0, left: 0, backgroundColor: 'red', zIndex: 1000}}>done: {isLevelComplete ? 'true' : 'false'}</div>
		</div>
	);
};

export default GameplayPage;