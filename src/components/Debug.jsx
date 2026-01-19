import { useGameContext } from '../context/useGameContext';
import { Link } from 'react-router-dom';
import { doPause, doPlay } from '../util/aniLevel';

import '../css/debug.css';

export const Debug = () => {
	const { debug, level, setLevel, character, setCharacter, timelines } = useGameContext();

	if (!debug) {
		return null;
	}

	
	return (
		<div className="sr-debug">
			<a href="#" onClick={() => window.location.reload()}>✖︎</a>
			<Link to="/">Intro</Link>
			<Link to="/gameplay">Gameplay</Link>
			<a href="#" onClick={() => setLevel(level - 1)}>←</a>level{level}<a href="#" onClick={() => setLevel(level + 1)}>→</a>
			<a href="#" onClick={() => setCharacter(character - 1)}>←</a>char{character}<a href="#" onClick={() => setCharacter(character + 1)}>→</a>
			<a href="#" onClick={() => doPause({timelines})}>⏸︎</a>
			<a href="#" onClick={() => doPlay({timelines})}>▶︎</a>
		</div>
	);
};