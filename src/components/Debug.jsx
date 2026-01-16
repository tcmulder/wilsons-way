import { Link } from 'react-router-dom';
import { useGameContext } from '../context/useGameContext';

import '../css/debug.css';

export const Debug = () => {
	const { debug, level, setLevel, character, setCharacter } = useGameContext();

	if (!debug) {
		return null;
	}

	
	return (
		<div className="sr-debug">
			<Link to="/">Intro</Link> | 
			<Link to="/gameplay">Gameplay</Link> | 
			<a href="#" onClick={() => setLevel(level - 1)}>Previous Level</a> | 
			<a href="#" onClick={() => setLevel(level + 1)}>Next Level</a> | 
			<a href="#" onClick={() => setCharacter(character - 1)}>Previous Character</a> | 
			<a href="#" onClick={() => setCharacter(character + 1)}>Next Character</a>
		</div>
	);
};