import { useMemo, useState } from 'react';
import { useScoreContext, useLevelContext } from '../context/useContexts';
import { Version } from './Version';
import { BackgroundRadius } from './BackgroundRadius';
import { doFreeze } from '../util/doMovement';
import ControlXIcon from '../images/control-x.inline.svg';
import ControlPauseIcon from '../images/control-pause.inline.svg';
import ControlPlayIcon from '../images/control-play.inline.svg';
import ControlSoundIcon from '../images/control-sound.inline.svg';
import '../css/interface.css';

const RestartControl = () => {
	return (
		<BackgroundRadius className="sr-interface-header__button">
			<button
			aria-label="Restart"
			onClick={() => {
				alert('Eventually this will restart the game from the beginning. For now, it just reloads the current page.');
				window.location.reload();
			}}
			>
				<ControlXIcon />
			</button>
		</BackgroundRadius>
	);
};

const PauseControl = () => {
	const [isPaused, setIsPaused] = useState(false);
	return (
		<BackgroundRadius className="sr-interface-header__button">
			<button
			aria-label={isPaused ? 'Resume' : 'Pause'}
			onClick={() => {
				setIsPaused(!isPaused);
				doFreeze(!isPaused);
			}}
			>
				{isPaused ? <ControlPlayIcon /> : <ControlPauseIcon />}
			</button>
		</BackgroundRadius>
	);
};

const SoundControl = () => {
	return (
		<BackgroundRadius className="sr-interface-header__button">
			<button aria-label="Sound">
				<ControlSoundIcon />
			</button>
		</BackgroundRadius>
	);
};

const Battery = () => {
	return (
		<BackgroundRadius className="sr-interface-header__battery">
			{` ← battery → `}
		</BackgroundRadius>
	);
};

const Score = () => {
	const { score } = useScoreContext();
	const { level } = useLevelContext();

	// Aggregated score: total, negative sum, positive sum, and score for current level only.
	const parsed = useMemo(() => {
		return {
			total: score.reduce((acc, curr) => acc + curr.num, 0),
			neg: score.reduce((acc, curr) => acc + (curr.num <= 0 ? curr.num : 0), 0),
			pos: score.reduce((acc, curr) => acc + (curr.num > 0 ? curr.num : 0), 0),
			level: score.reduce((acc, curr) => acc + (curr.level === level ? curr.num : 0), 0),
		};
	}, [score, level]);
	return (
		<BackgroundRadius className="sr-interface-header__score">{parsed.total.toLocaleString()}</BackgroundRadius>
	);
};

const Progress = () => {
	return (
		<progress className="sr-interface-progress" value="50" max="100" aria-label="Progress">50%</progress>
	);
};

/**
 * Persistent game interface.
 * 
 * @returns {React.ReactNode} The Interface component.
 */
export const Interface = () => {
	return (
		<>
			<nav className="sr-interface-header">
				<RestartControl />
				<PauseControl />
				<SoundControl />
				<Battery />
				<Score />
			</nav>
			<footer className="sr-interface-footer">
				<Progress />
				<Version />
			</footer>
		</>
	);
};