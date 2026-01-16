import { Link } from 'react-router-dom';

import '../css/interface.css';

export const Interface = () => {
	return (
		<nav className="sr-interface">
			<Link to="/">Intro</Link>
			|
			<Link to="/gameplay">Gameplay</Link>
		</nav>
	);
};