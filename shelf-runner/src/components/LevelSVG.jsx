import { useState, useEffect } from 'react';
import { useGameContext } from '../context/useGameContext';

const LevelSVG = () => {
	const { level } = useGameContext();
	const [svgContent, setSvgContent] = useState('');

	useEffect(() => {
		const loadSvg = async () => {
			try {
				// Use dynamic import to get the SVG URL, then fetch its content
				const svgModule = await import(`../svg/level-${level}.svg?url`);
				const response = await fetch(svgModule.default);
				const svgText = await response.text();
				setSvgContent(svgText);
			} catch (error) {
				console.error(`Failed to load level ${level} SVG:`, error);
				setSvgContent('');
			}
		};

		loadSvg();
	}, [level]);

	return (
		<div className="sr-level-svg" dangerouslySetInnerHTML={{ __html: svgContent }} />
	);
};

export default LevelSVG;