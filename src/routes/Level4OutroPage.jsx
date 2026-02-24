import { Link } from 'react-router-dom';
import { useResetLevelComplete } from '../hooks/useCompleteLevel';

const Level4OutroPage = () => {
	useResetLevelComplete();

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
