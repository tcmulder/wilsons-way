import '../css/character.css';

const Character = () => {
	return (
		<div className="sr-character" tabindex="0">
			[CHARACTER_SVG]
			<div className="sr-character-svg" />
			<div className="sr-character-crash" aria-hidden="true" />
			<div className="sr-character-backpack">
				<div className="sr-character-score" />
			</div>
		</div>
	);
};

export default Character;