import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDebugContext, useGameplayContext, useLevelContext } from '../context/useContexts';
import { doPause, doPlay } from '../util/doMovement';

import '../css/debug.css';

const DebugRestart = () => {
	return (
		<button onClick={(e) => { e.preventDefault(); window.location.reload(); }}>✖︎</button>
	);
};

const DebugNavigation = ({navigate}) => {
	return (
		<select onChange={(e) => { e.preventDefault(); navigate(e.target.value); }}>
			<option value="/">Intro</option>
			<option value="/gameplay">Gameplay</option>
		</select>
	);
}

const DebugPlayPause = ({ character, timelines, status, setStatus, path, navigate, setLevel }) => {
	if (path === '/gameplay' && status.pause === 'pause') {
		return <button onClick={(e) => { e.preventDefault(); doPlay({timelines: [...timelines, character.timeline], setStatus, direction: 'forward'}); }}>▶︎</button>
	} else if (path === '/gameplay' && status.pause === 'none') {
		return <button onClick={(e) => { e.preventDefault(); doPause({timelines: [...timelines, character.timeline], setStatus}); }}>⏸︎</button>
	} else {
		return <button onClick={(e) => { e.preventDefault(); navigate('/gameplay'); setLevel(1); }}>⏯︎</button>
	}
};

const DebugLevel = ({ level, setLevel, path }) => {
	if (path !== '/gameplay') return null;
	return (
		<span>
			<button onClick={(e) => { e.preventDefault(); setLevel(level - 1); }}>←</button>level{level}<button onClick={(e) => { e.preventDefault(); setLevel(level + 1); }}>→</button>
		</span>
	);
};

const DebugCharacter = ({ character, setCharacter, path }) => {
	if (path !== '/gameplay') return null;
	return (
		<span>
			<button onClick={(e) => { e.preventDefault(); setCharacter({...character, id: character.id - 1}); }}>←</button>char{character.id}<button onClick={(e) => { e.preventDefault(); setCharacter({...character, id: character.id + 1}); }}>→</button>
		</span>
	);
};

export const Debug = () => {
	const { debug } = useDebugContext();
	const { status, setStatus, character, setCharacter, timelines } = useGameplayContext();
	const { level, setLevel } = useLevelContext();
	const props = { debug, status, setStatus, level, setLevel, character, setCharacter, timelines };
	const navigate = useNavigate();
	const path = useLocation().pathname;
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	
	useEffect(() => {
		if (debug?.level) {
			setLevel(parseInt(debug.level));
		}
	}, [debug?.level, setLevel]);
	
	if (!debug) {
		return null;
	}
	
	return (
		<div className="sr-debug">
			<button onClick={(e) => { e.preventDefault(); setIsMenuOpen(!isMenuOpen); }}>Debug</button>
			{isMenuOpen && (
				<ul className="sr-debug__menu">
					<li><DebugNavigation {...props} navigate={navigate} path={path} /></li>
					<li><DebugRestart /></li>
					<li><DebugPlayPause {...props} path={path} navigate={navigate} /></li>
					<li><DebugLevel {...props} path={path} /></li>
					<li><DebugCharacter {...props} path={path} /></li>
				</ul>
			)}
		</div>
	);
};