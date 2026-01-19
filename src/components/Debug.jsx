import { useGameContext } from '../context/useGameContext';
import { useNavigate } from 'react-router-dom';
import { doPause, doPlay } from '../util/doMovement';

import '../css/debug.css';

export const Debug = () => {
	const navigate = useNavigate();
	const { debug, level, setLevel, character, setCharacter, timelines, status, setStatus } = useGameContext();

	if (!debug) {
		return null;
	}
	
	return (
		<div className="sr-debug">
			<button onClick={(e) => { e.preventDefault(); window.location.reload(); }}>✖︎</button>
			{'pause' === status.pause ? (
				<>
					<button onClick={(e) => { e.preventDefault(); doPlay({timelines: [...timelines, character.timeline], setStatus}); }}>▶︎</button>
					<button onClick={(e) => { e.preventDefault(); navigate('/'); }}>Intro</button>
					<button onClick={(e) => { e.preventDefault(); navigate('/gameplay'); setLevel(1); }}>Gameplay</button>
				</>
			) : (
				<button onClick={(e) => { e.preventDefault(); doPause({timelines: [...timelines, character.timeline], setStatus}); }}>⏸︎</button>
			)}
			<span>
				<button onClick={(e) => { e.preventDefault(); setLevel(level - 1); }}>←</button>level{level}<button onClick={(e) => { e.preventDefault(); setLevel(level + 1); }}>→</button>
			</span>
			<span>
				<button onClick={(e) => { e.preventDefault(); setCharacter({...character, id: character.id - 1}); }}>←</button>char{character.id}<button onClick={(e) => { e.preventDefault(); setCharacter({...character, id: character.id + 1}); }}>→</button>
			</span>
		</div>
	);
};