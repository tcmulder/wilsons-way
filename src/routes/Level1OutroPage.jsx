import { Link } from 'react-router-dom';

const Level1OutroPage = () => {
	return (
		<div>
			<h1>You've completed Level 1!</h1>
			<Link to="/level/2">
				Next Level &gt;&gt;
			</Link>
		</div>
	);
};

export default Level1OutroPage;
