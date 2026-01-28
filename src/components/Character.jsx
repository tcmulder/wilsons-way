import { useRef, useCallback } from 'react';
import { useGameContext } from '../context/useGameContext';
import SVG from './SVG';
import { createAniSprite } from '../util/aniSprite';
import { useCharacterMovement } from '../util/doMovement';
import '../css/character.css';

const Character = () => {
	const { status, character, setCharacter, setStatus, jump } = useGameContext();
	const characterRef = useRef(null);
	const characterSvgRef = useRef(null);
	const characterSVG = `${window.sr.url}public/svg/character-${character.id}.svg`;

	const handleSvgLoad = useCallback((svgElement) => {
		if (characterSvgRef.current && svgElement) {
			characterSvgRef.current.replaceChildren(svgElement);
			const timeline = createAniSprite({elParent: characterSvgRef.current, status});
			setCharacter(prev => ({...prev, timeline}));
		}
	}, [setCharacter, character.id, status]);

	useCharacterMovement({ status, setStatus, characterRef, jump });

	return (
		<div ref={characterRef} className="sr-character" tabIndex="0" data-move="forward" data-jump="none" data-pause="none">
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