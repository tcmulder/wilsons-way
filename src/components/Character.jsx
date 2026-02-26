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
	const characterSvgUrl = `${window.sr.url}public/svg/character-${characterId}.svg`;

	// When the SVG loads, create the animation sprite and replace the character SVG with it.
	const handleSvgLoad = useCallback((svgElement) => {
		if (characterSvgRef.current && svgElement) {
			characterSvgRef.current.replaceChildren(svgElement);
			createAniSprite({elParent: characterSvgRef.current});
		}
	}, []);

	// Update the character status ref when the character status changes
	useEffect(() => {
		// We use a ref so we can update the status from the movement hook without re-rendering the component.
		statusRef.current = { ...statusRef.current, ...characterStatus };
	}, [characterStatus, statusRef]);

	// Apply the movement hook to the character (handles keyboard controls and autoplay).
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

	// Render the character component.
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
				<SVG path={characterSvgUrl} onSvgLoad={handleSvgLoad} />
			</div>
			<div className="sr-character-crash" aria-hidden="true" style={{'--sr-difficulty-crash': userAdjustedCrash || 1}} />
			<div className="sr-character-message" />
		</div>
	);
};

export default Character;