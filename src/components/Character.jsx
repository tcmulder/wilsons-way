import { useRef, useCallback } from 'react';
import { useDebugContext, useSettingsContext, useStatusContext, useCharacterContext, useTimelinesContext } from '../context/useContexts';
import SVG from './SVG';
import { createAniSprite } from '../util/aniSprite';
import { useCharacterMovement } from '../util/doMovement';
import '../css/character.css';

const Character = () => {
	const { debug } = useDebugContext();
	const { jump } = useSettingsContext();
	const { status, setStatus } = useStatusContext();
	const { character, setCharacter } = useCharacterContext();
	const { timelines } = useTimelinesContext();
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

	useCharacterMovement({ debug, status, setStatus, characterRef, jump, timelines });

	return (
		<div ref={characterRef} className="sr-character" tabIndex="0" data-move={status.move} data-jump={status.jump} data-pause={status.pause}>
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