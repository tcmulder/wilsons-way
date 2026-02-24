import { Link } from 'react-router-dom';
import { useResetLevelComplete } from '../hooks/useCompleteLevel';

const Level2OutroPage = () => {
	useResetLevelComplete();

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
