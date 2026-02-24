import { useRef, useCallback, useEffect } from 'react';
import { useDebugContext, useSettingsContext, useCharacterContext, useGameplayContext, useLevelContext } from '../context/useContexts';
import SVG from './SVG';
import { createAniSprite } from '../util/aniSprite';
import { useCharacterMovement } from '../util/doMovement';
import '../css/character.css';

/**
 * Character hero: loads character SVG by id, runs sprite animation, applies movement hook and modifier classes.
 * 
 * @returns {React.ReactNode} The Character component.
 */
const Character = () => {
	const { debug } = useDebugContext();
	const { characterId, characterStatus, setCharacterStatus, characterModifiers } = useCharacterContext();
	const { timelinesRef, elevationRef, statusRef, elsRef, jumpRef } = useGameplayContext();
	const { settings } = useSettingsContext();
	const { userAdjustedCrash, characterHeight } = settings;
	const { currentLevelId } = useLevelContext();
	const characterSvgRef = useRef(null);
	const characterSVG = `${window.sr.url}public/svg/character-${characterId}.svg`;

	const handleSvgLoad = useCallback((svgElement) => {
		if (characterSvgRef.current && svgElement) {
			characterSvgRef.current.replaceChildren(svgElement);
			createAniSprite({elParent: characterSvgRef.current});
		}
	}, []);

	useEffect(() => {
		statusRef.current = { ...statusRef.current, ...characterStatus };
	}, [characterStatus, statusRef]);

	useCharacterMovement({
		debug,
		characterStatus,
		setCharacterStatus,
		jumpRef,
		timelinesRef,
		elevationRef,
		statusRef,
		elsRef,
		currentLevelId,
	});

	return (
		<div
			className={`sr-character${characterModifiers.map(modifier => ` is-mod-${modifier}`).join('')}`}
			tabIndex="0"
			data-move={characterStatus.move}
			data-jump={characterStatus.jump}
			data-ani={characterStatus.ani}
			style={{'--sr-h-character': `${characterHeight}cqmin`}}
		>
			<div className="sr-character-svg" ref={characterSvgRef}>
				<SVG path={characterSVG} onSvgLoad={handleSvgLoad} />
			</div>
			<div className="sr-character-crash" aria-hidden="true" style={{'--sr-difficulty-crash': userAdjustedCrash || 1}} />
			<div className="sr-character-mesage" />
		</div>
	);
};

export default Character;