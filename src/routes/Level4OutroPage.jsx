import { Link } from 'react-router-dom';
import { useLevelContext } from '../context/useContexts';

/**
 * Level 4 completion screen.
 */
const Level4OutroPage = () => {
	const { level } = useLevelContext();
	return (
		<div>
			<h1>You've completed Level {level}!</h1>
			<Link to={`/level/${level + 1}`}>
				Load Level {level + 1} &gt;&gt;
			</Link>
		</div>
	);
};

export default Level4OutroPage;
