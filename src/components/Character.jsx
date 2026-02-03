import { useRef, useCallback } from 'react';
import { useDebugContext, useSettingsContext, useCharacterContext, useGameplayContext } from '../context/useContexts';
import SVG from './SVG';
import { createAniSprite } from '../util/aniSprite';
import { useCharacterMovement } from '../util/doMovement';
import '../css/character.css';

const Character = () => {
	const { debug } = useDebugContext();
	const { jump } = useSettingsContext();
	const { characterId, characterStatus, setCharacterStatus } = useCharacterContext();
	const { timelinesRef, elevationRef } = useGameplayContext();
	const characterRef = useRef(null);
	const characterSvgRef = useRef(null);
	const characterSVG = `${window.sr.url}public/svg/character-${characterId}.svg`;

	const handleSvgLoad = useCallback((svgElement) => {
		if (characterSvgRef.current && svgElement) {
			characterSvgRef.current.replaceChildren(svgElement);
			const timeline = createAniSprite({elParent: characterSvgRef.current, status: characterStatus});
			timelinesRef.current = [...timelinesRef.current, timeline];
		}
	}, [characterStatus, timelinesRef]);

	useCharacterMovement({ debug, characterStatus, setCharacterStatus, characterRef, jump, timelinesRef, elevationRef });

	return (
		<div ref={characterRef} className="sr-character" tabIndex="0" data-move={characterStatus.move} data-jump={characterStatus.jump} data-pause={characterStatus.pause}>
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