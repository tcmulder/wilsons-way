import { useRef, useCallback } from 'react';
import { useGameContext } from '../context/useGameContext';
import SVG from './SVG';
import { createAniSprite } from '../util/aniSprite';
import '../css/character.css';

const Character = () => {
	const { character } = useGameContext();
	const characterSvgRef = useRef(null);
	const characterSVG = `../svg/character-${character}.svg?url`;

	const handleSvgLoad = useCallback(async (svgElement) => {
		if (characterSvgRef.current && svgElement) {
			// Clear any existing SVG and add the new one
			characterSvgRef.current.replaceChildren(svgElement);
			// Now query for sprite elements within the ref and convert NodeList to array
			const spriteElements = Array.from(characterSvgRef.current.querySelectorAll('[data-sprite]'));
			createAniSprite(spriteElements);
		}
	}, []);

	return (
		<div className="sr-character" tabIndex="0" data-move="forward" data-jump="none" data-pause="none">
			<div className="sr-character-svg" ref={characterSvgRef}>
				<SVG path={characterSVG} onSvgLoad={handleSvgLoad} />
			</div>
			<div className="sr-character-crash" aria-hidden="true" />
			<div className="sr-character-backpack">
				<div className="sr-character-score" />
			</div>
		</div>
	);
};

export default Character;