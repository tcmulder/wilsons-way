import { Link } from 'react-router-dom';
import { useScoreContext } from '../context/useContexts';
import '../css/interface.css';

export const Interface = () => {
	const { score } = useScoreContext();
	return (
		<nav className="sr-interface">
			<Link to="/">Intro</Link>
			|
			<Link to="/gameplay">Gameplay</Link>
			|
			<span>Score: {score}</span>
		</nav>
	);
};