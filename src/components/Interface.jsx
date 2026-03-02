import { useMemo } from 'react';
import { useScoreContext, useLevelContext } from '../context/useContexts';
import { Version } from './Version';
import { BackgroundRadius } from './BackgroundRadius';
import '../css/interface.css';

const RestartControl = () => {
	return (
		<span className="sr-interface-control sr-interface-control--restart">🔄</span>
	);
};

const PauseControl = () => {
	return (
		<span className="sr-interface-control sr-interface-control--pause">⏸️</span>
	);
};

const SoundControl = () => {
	return (
		<span className="sr-interface-control sr-interface-control--sound">🔊</span>
	);
};

const Battery = () => {
	return (
		<span className="sr-interface-die">🪫</span>
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
		<span className="sr-interface-score"><em>💯 {parsed.pos}-{Math.abs(parsed.neg)}</em>={parsed.total}</span>
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
				<BackgroundRadius className="sr-interface-header__circle" backgroundColor="var(--sr-c-navy)" borderColor="var(--sr-c-azure)">
					<button style={{color: 'var(--sr-c-white)'}}>
						Close
					</button>
				</BackgroundRadius>
			</nav>
			<footer className="sr-interface-footer">
				<Progress />
				<Version />
			</footer>
		</>
	);
};