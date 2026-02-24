import { Link } from 'react-router-dom';

/**
 * Level 3 completion screen.
 * 
 * @returns {React.ReactNode} The Level3OutroPage component.`
 */
const Level3OutroPage = () => {
	return (
		<div>
			<h1>You've completed Level 3!</h1>
			<Link to="/level/4">
				Next Level &gt;&gt;
			</Link>
		</div>
	);
};

export default Level3OutroPage;
