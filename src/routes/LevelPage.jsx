import { useRef, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';
import {
	useDebugContext,
	useSettingsContext,
	useLevelContext,
	useGameplayContext,
	useCharacterContext,
	useScoreContext,
} from '../context/useContexts';
import { useGameAudio } from '../hooks/useSFX';
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
	const { settings, jump } = useSettingsContext();
	const { gameplaySpeed, userAdjustedSpeed } = settings;
	const { level, setLevel, setCurrentLevelId } = useLevelContext();
	const { setCharacterStatus } = useCharacterContext();
	const { setScore } = useScoreContext();
	const { playSound } = useGameAudio();
	const gameplayContext = useGameplayContext();
	const gameplayContextRef = useRef(gameplayContext);
	const gameplayRef = useRef(null);

	// Set global animations speed
	useEffect(() => {
		gsap.globalTimeline.timeScale(userAdjustedSpeed / 50);
	}, [userAdjustedSpeed]);

	// Run movement on every GSAP tick (running, jumping, any animation) without duplicates
	useEffect(() => {
		const tick = () => trackMovement({
			gameplayContextRef,
			setCharacterStatus,
			setScore,
			level,
			playSound,
			jump,
		});
		gsap.ticker.add(tick);
		return () => gsap.ticker.remove(tick);
	}, [setCharacterStatus, setScore, playSound, jump, level]);

	// Load SVG for level and add movement to it
	const handleSvgLoad = useCallback(async (svgElement) => {
		const ctx = gameplayContextRef.current;
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
			});
			setCurrentLevelId(Date.now());
		}
	}, [gameplaySpeed, setCurrentLevelId]);

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
			});
		}
	}, [debug, gameplaySpeed, setCurrentLevelId, gameplayContext, setLevel]);
	
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
		</div>
	);
};

export default GameplayPage;