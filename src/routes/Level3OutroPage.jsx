import { Link } from 'react-router-dom';

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
