import { Link } from 'react-router-dom';

const Level4OutroPage = () => {
	return (
		<div>
			<h1>You've completed Level 4!</h1>
			<Link to="/">
				Back to Start
			</Link>
		</div>
	);
};

export default Level4OutroPage;
