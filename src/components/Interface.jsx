import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScoreContext, useLevelContext, useSettingsContext } from '../context/useContexts';
import { Version } from './Version';
import { EightBit, EightBitCircle, EightBitPill } from './EightBit';
import { doFreeze } from '../util/doMovement';
import ControlXIcon from '../images/control-x.svg?react';
import ControlPauseIcon from '../images/control-pause.svg?react';
import ControlPlayIcon from '../images/control-play.svg?react';
import ControlSoundIcon from '../images/control-sound.svg?react';
import ControlMuteIcon from '../images/control-mute.svg?react';
import '../css/interface.css';

/**
 * Restart game (resetting all state to their initial values)
 * 
 * @returns {React.ReactNode} The RestartControl component.
 */
const RestartControl = () => {
	const navigate = useNavigate();
	return (
		<EightBit className="sr-interface-header__circle" bg={<EightBitCircle />}>
			<button
				aria-label="Restart"
				onClick={() => {
					const shouldRestart = confirm('Are you sure? Your progress will be lost.');
					if (shouldRestart) {
						navigate('/restart');
					}
				}}
			>
				<ControlXIcon className="sr-interface-header__icon" />
			</button>
		</EightBit>
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
		<EightBit className="sr-interface-header__circle" bg={<EightBitCircle />}>
			<button
				aria-label={isPaused ? 'Resume' : 'Pause'}
				onClick={() => {
					setIsPaused(!isPaused);
					doFreeze(!isPaused);
				}}
			>
				{isPaused ? <ControlPlayIcon className="sr-interface-header__icon" /> : <ControlPauseIcon className="sr-interface-header__icon" />}
			</button>
		</EightBit>
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
		<EightBit className="sr-interface-header__circle" bg={<EightBitCircle />}>
			<button
				aria-label={makeSFX ? 'Sound Effects on' : 'Sound Effects off'}
				onClick={(e) => {
					e.preventDefault();
					setMakeSFX((prev) => !prev);
				}}
			>
				{makeSFX ? <ControlSoundIcon className="sr-interface-header__icon" /> : <ControlMuteIcon className="sr-interface-header__icon" />}
			</button>
		</EightBit>
	);
};

/**
 * Battery life indicator
 * 
 * @returns {React.ReactNode} The Battery component.
 */
const Battery = () => {
	const { lives } = useScoreContext();
	const cur = Number.isFinite(lives?.cur) ? lives.cur : 10;
	const max = Number.isFinite(lives?.max) ? lives.max : 10;
	return (
		<EightBit className="sr-interface-header__battery" bg={<EightBitPill />} center={false}>
			<div className="sr-interface-header__battery-bars">
				{Array(max || 0).fill(0).map((_, index) => {
					return <span key={index}>{index < cur ? '🔋' : '🪫'}</span>;
				})}
			</div>
		</EightBit>
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
		<EightBit className="sr-interface-header__score" bg={<EightBitPill />}><span>{parsed.total.toLocaleString()}</span></EightBit>
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