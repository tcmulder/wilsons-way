import { useEffect, useRef } from 'react';
import { useGameContext } from '../context/useGameContext';
import { loadSvgLevel } from '../util/level';

const GameplayPage = () => {
	const { level } = useGameContext();
	const boardRef = useRef(null);

	useEffect(() => {
		const loadSvg = async () => {
			if (!boardRef.current) return;

			try {
				// Use dynamic import to get the SVG URL, then fetch its content
				const svgModule = await import(`../svg/level-${level}.svg?url`);
				const response = await fetch(svgModule.default);
				const svgText = await response.text();
				
				// Parse the SVG string to get the SVG element
				const parser = new DOMParser();
				const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
				const svgElement = svgDoc.querySelector('svg');
				
				if (svgElement && boardRef.current) {
					// Import the SVG element into the current document
					const importedSvg = document.importNode(svgElement, true);
					
					// Process the SVG using loadSvgLevel
					await loadSvgLevel(boardRef.current, importedSvg);
				}
			} catch (error) {
				console.error(`Failed to load level ${level} SVG:`, error);
			}
		};

		loadSvg();
	}, [level]);

	return (
		<div className="sr-board" ref={boardRef} />
	);
};

export default GameplayPage;