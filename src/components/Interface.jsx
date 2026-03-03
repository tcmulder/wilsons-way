import { useMemo, useState } from 'react';
import { useScoreContext, useLevelContext, useSettingsContext } from '../context/useContexts';
import { Version } from './Version';
import { BackgroundRadius } from './BackgroundRadius';
import { doFreeze } from '../util/doMovement';
import ControlXIcon from '../images/control-x.inline.svg';
import ControlPauseIcon from '../images/control-pause.inline.svg';
import ControlPlayIcon from '../images/control-play.inline.svg';
import ControlSoundIcon from '../images/control-sound.inline.svg';
import ControlMuteIcon from '../images/control-mute.inline.svg';
import '../css/interface.css';

/**
 * Restart game (resetting all state to their initial values)
 * 
 * @returns {React.ReactNode} The RestartControl component.
 */
const RestartControl = () => {
	return (
		<BackgroundRadius className="sr-interface-header__button">
			<button
				aria-label="Restart"
				onClick={() => {
					const shouldRestart = confirm('Are you sure? Your progress will be lost.');
					if (shouldRestart) window.location.href = '/';
				}}
			>
				<ControlXIcon />
			</button>
		</BackgroundRadius>
	);
};

/**
 * Pause/resume game
 * 
 * @returns {React.ReactNode} The PauseControl component.
 */
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


/**
 * Sound control (on/off)
 * 
 * @returns {React.ReactNode} The SoundControl component.
 */
const SoundControl = () => {
	const { makeSFX, setMakeSFX } = useSettingsContext();
	return (
		<BackgroundRadius className="sr-interface-header__button">
			<button
				aria-label={makeSFX ? 'Sound Effects on' : 'Sound Effects off'}
				onClick={(e) => {
					e.preventDefault();
					setMakeSFX((prev) => !prev);
				}}
			>
				{makeSFX ? <ControlSoundIcon /> : <ControlMuteIcon />}
			</button>
		</BackgroundRadius>
	);
};

/**
 * Battery life indicator
 * 
 * @returns {React.ReactNode} The Battery component.
 */
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