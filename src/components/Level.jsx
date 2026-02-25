import { useRef, useCallback, useEffect } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import {
	useSettingsContext,
	useLevelContext,
	useGameplayContext,
} from '../context/useContexts';
import { loadLevel } from '../util/loadLevel';
import SVG from '../components/SVG';
import Character from '../components/Character';
import Gameplay from '../components/Gameplay';
import { aniLevel } from '../util/aniLevel';
import { useCustomLevelSvg } from '../hooks/useCustomLevelSvg';

import '../css/board.css';
import '../css/parallax.css';
import '../css/obstacles.css';
import '../css/milestones.css';

/**
 * Level screen: loads level SVG, runs parallax animation, handles level completion outro. Supports debug drag-and-drop SVG.
 *
 * @returns {React.ReactNode} The Level component.
 */
const Level = () => {
	const { settings } = useSettingsContext();
	const { gameplaySpeed, userAdjustedSpeed } = settings;
	const { level, setCurrentLevelId, customLevelSvg } = useLevelContext();
	const gameplayContext = useGameplayContext();
	const gameplayRef = useRef(null);
	const navigate = useNavigate();

	// Set global animations speed
	useEffect(() => {
		gsap.globalTimeline.timeScale(userAdjustedSpeed / 50);
	}, [userAdjustedSpeed]);

	// When a level completes, advance to the next level route
	const handleLevelComplete = useCallback(() => {
		navigate(`/outro/${level}`);
	}, [navigate, level]);

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
				onComplete: handleLevelComplete,
			});
			setCurrentLevelId(Date.now());
		}
	}, [gameplaySpeed, gameplayContext, handleLevelComplete, setCurrentLevelId]);

	// When using a custom dropped SVG (level 0), load and animate it
	useCustomLevelSvg({
		level,
		customLevelSvg,
		gameplayContext,
		gameplaySpeed,
		handleLevelComplete,
		setCurrentLevelId,
	});

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

export default Level;
