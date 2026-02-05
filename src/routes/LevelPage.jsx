import { useRef, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';
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
	const gameplayContextRef = useRef(gameplayContext);
	const difficultySpeed = settings.difficultySpeed * 0.75;
	const gameplayRef = useRef(null);

	useEffect(() => {
		gameplayContextRef.current = gameplayContext;
	}, [gameplayContext]);

	// Run trackMovement on every GSAP tick (running, jumping, any animation) without duplicates
	useEffect(() => {
		const tick = () => trackMovement(gameplayContextRef.current);
		gsap.ticker.add(tick);
		return () => gsap.ticker.remove(tick);
	}, []);

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
				difficultySpeed,
			});
			setCurrentLevelId(Date.now());
		}
	}, [difficultySpeed, setCurrentLevelId]);

	useEffect(() => {
		if (gameplayContext.elsRef.current.elBoard) {
			return allowDrop({
				elBoard: gameplayContext.elsRef.current.elBoard,
				debug,
				setTimelines: (timelines) => { gameplayContext.timelinesRef.current = timelines; },
				difficultySpeed,
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