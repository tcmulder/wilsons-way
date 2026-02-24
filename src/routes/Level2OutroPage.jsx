import { Link } from 'react-router-dom';

/**
 * Level 2 completion screen.
 * 
 * @returns {React.ReactNode} The Level2OutroPage component.`
 */
const Level2OutroPage = () => {
	return (
		<div>
			<h2>You've completed Level 2!</h2>
			<Link to="/level/3">
				Next Level &gt;&gt;
			</Link>
		</div>
	);
};

export default Level2OutroPage;
