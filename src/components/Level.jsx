import { useRef, useCallback, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useSettingsContext, useLevelContext, useGameplayContext, useDebugContext, useCharacterContext } from '../context/useContexts';
import { loadLevel } from '../util/loadLevel';
import SVG from '../components/SVG';
import { Interface } from '../components/Interface';
import Character from '../components/Character';
import Gameplay from '../components/Gameplay';
import { aniLevel } from '../util/aniLevel';
import { useCustomLevelSvg } from '../hooks/useCustomLevelSvg';
import { doRun, doPause } from '../util/doMovement';
import '../css/board.css';
import '../css/parallax.css';
import '../css/obstacles.css';
import '../css/milestones.css';

const Countdown = ({ countdown, setCountdown }) => {
	const { debug } = useDebugContext();
	const { setCharacterStatus } = useCharacterContext();
	const { timelinesRef } = useGameplayContext();
	useEffect(() => {
		if (debug?.autoplay !== false) {
			if (countdown > 0) {
				doPause({ timelines: timelinesRef.current, setCharacterStatus });
				const timer = setTimeout(() => {
					setCountdown((prev) => prev - 1);
				}, 1000);
				return () => clearTimeout(timer);
			} else {
				doRun({ timelines: timelinesRef.current, setCharacterStatus, direction: 'forward' });
			}
		}
	}, [countdown, setCountdown, debug?.autoplay, timelinesRef, setCharacterStatus]);
	return countdown > 0 ? <div className="sr-countdown">{countdown}</div> : null;
};

/**
 * Level screen: loads level SVG, runs parallax animation, handles level completion outro. Supports debug drag-and-drop SVG.
 *
 * @returns {React.ReactNode} The Level component.
 */
const Level = () => {
	const { debug } = useDebugContext();
	const { settings, levelPhysics, setLevelPhysics } = useSettingsContext();
	const { version, gameplaySpeed, userAdjustedSpeed } = settings;
	const { level, currentLevelId, setCurrentLevelId, customLevelSvg } = useLevelContext();
	const gameplayContext = useGameplayContext();
	const { setGameplayNavigation, elsRef, timelinesRef } = gameplayContext;
	const gameplayRef = useRef(null);
	const [countdown, setCountdown] = useState(0);
	const levelUrl = `${window.sr.url}public/svg/level-${level}.svg?v=${version}`;

	// Set global animations speed
	useEffect(() => {
		gsap.globalTimeline.timeScale(userAdjustedSpeed * levelPhysics.speed);
	}, [userAdjustedSpeed, levelPhysics.speed]);

	// When a level completes, advance to the next level route
	const handleLevelComplete = useCallback(() => {
		setGameplayNavigation(`/level/${level}/flag`);
	}, [level, setGameplayNavigation]);

	// Update physics based on this level when it loads
	useEffect(() => {
		const newPhysics = { speed: 1, jump: 1, hangtime: 1 };
		const dataset = document.querySelector('.sr-level')?.dataset || {};
		if (dataset.speed) {
			newPhysics.speed = dataset.speed / 100;
		}
		if (dataset.jump) {
			newPhysics.jump = dataset.jump / 100;
		}
		if (dataset.hangtime) {
			newPhysics.hangtime = dataset.hangtime / 100;
		}
		setLevelPhysics(newPhysics);
	}, [setLevelPhysics, currentLevelId]);

	// Set level ID as null when the level component unmounts
	useEffect(() => {
		return () => {
			setCurrentLevelId(null);
		};
	}, [setCurrentLevelId]);

	// Load SVG for level and add movement to it
	const handleSvgLoad = useCallback(async (svgElement) => {
		const elBoard = elsRef?.current?.elBoard;
		if (elBoard && svgElement) {
			// Setup level SVG
			await loadLevel({
				elBoard,
				elSVG: svgElement,
			});
			// Create animation after level is loaded
			aniLevel({
				elBoard,
				timelinesRef,
				setTimelines: (timelines) => { timelinesRef.current = timelines; },
				gameplaySpeed,
				onComplete: handleLevelComplete,
			});
			// Set a unique level id
			setCurrentLevelId(Date.now());
			if (debug?.autoplay !== false) {
				setCountdown(3);
			}
		}
	}, [elsRef, timelinesRef, gameplaySpeed, handleLevelComplete, setCurrentLevelId, debug?.autoplay]);


	// When using a custom-dropped SVG (level 0), load and animate it
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
			<Interface />
			<Gameplay boardRef={gameplayRef} />
			<Countdown countdown={countdown} setCountdown={setCountdown} />
			<div className="sr-board">
				{/* If level is 0, we're using a drag-and-dropped custom level, so don't load a numbered SVG file */}
				{level !== 0 && levelUrl && <SVG path={levelUrl} onSvgLoad={handleSvgLoad} />}
			</div>
			<Character />
		</div>
	);
};

export default Level;
