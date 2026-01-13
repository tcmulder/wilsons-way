import { useGameContext } from '../context/useGameContext';
import SVG from './SVG';
import '../css/character.css';

const Character = () => {
	const { character } = useGameContext();

	const characterSVG = `../svg/character-${character}.svg?url`;
	return (
		<div className="sr-character" tabindex="0">
			<SVG path={characterSVG} />
			<div className="sr-character-svg" />
			<div className="sr-character-crash" aria-hidden="true" />
			<div className="sr-character-backpack">
				<div className="sr-character-score" />
			</div>
		</div>
	);
};

export default Character;