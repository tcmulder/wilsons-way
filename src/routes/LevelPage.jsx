import { useRef, useCallback } from 'react';
import { useGameContext } from '../context/useGameContext';
import { loadLevel } from '../util/loadLevel';
import { gsap } from 'gsap';
import SVG from '../components/SVG';
import Character from '../components/Character';

import '../css/board.css';
import '../css/parallax.css';


const GameplayPage = () => {
	const { level, setTimelines, settings: { difficultySpeed } } = useGameContext();
	const boardRef = useRef(null);

	const createAnimation = useCallback(() => {
		if (!boardRef.current) return;
		
		// Kill all existing timelines
		setTimelines(prevTimelines => {
			prevTimelines.forEach(timeline => timeline.kill());
			return [];
		});
		
		// Find all direct descendant SVGs
		const svgElements = boardRef.current.querySelectorAll(':scope > svg');

		// Determine animation duration
		const svgWidth = parseInt(svgElements[0].getAttribute('viewBox').split(' ')[2]) / 2;
		const mod = (difficultySpeed / 100) / 100;
		const gameplayDuration = mod * svgWidth;
		
		// Create a separate timeline for each SVG
		const timelines = [];
		svgElements.forEach((svg) => {
			const speed = -1 * (parseInt(svg.dataset.parallax) || 100);
			const svgTimeline = gsap.timeline();
			svgTimeline
			.fromTo(
				svg,
				{ x: 0, xPercent: 0 },
				{
					xPercent: speed,
					x: '100cqw',
					ease: 'none',
					duration: gameplayDuration,
				},
				0,
			);
			timelines.push(svgTimeline);
		});
		
		// Store all timelines in context
		setTimelines(timelines);
	}, [setTimelines, difficultySpeed]);

	const handleSvgLoad = useCallback(async (svgElement) => {
		if (boardRef.current && svgElement) {
			await loadLevel(boardRef.current, svgElement);
			createAnimation();
		}
	}, [createAnimation]);

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