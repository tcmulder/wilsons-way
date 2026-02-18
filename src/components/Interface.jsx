import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useScoreContext, useLevelContext } from '../context/useContexts';
import '../css/interface.css';
import '../css/modifiers.css';

export const Interface = () => {
	const { score } = useScoreContext();
	const { level } = useLevelContext();
	
	const parsed = useMemo(() => {
		return {
			total: score.reduce((acc, curr) => acc + curr.num, 0),
			neg: score.reduce((acc, curr) => acc + (curr.num <= 0 ? curr.num : 0), 0),
			pos: score.reduce((acc, curr) => acc + (curr.num > 0 ? curr.num : 0), 0),
			level: score.reduce((acc, curr) => acc + (curr.level === level ? curr.num : 0), 0),
		};
	}, [score, level]);

	return (
		<nav className="sr-interface">
			<Link to="/">Intro</Link>
			|
			<Link to="/gameplay">Gameplay</Link>
			|
			<span><em>score: {parsed.pos}-{Math.abs(parsed.neg)}</em>={parsed.total}</span>
			|
			<span>level {level} score: {parsed.level}</span>
		</nav>
	);
};