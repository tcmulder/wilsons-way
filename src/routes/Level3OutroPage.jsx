import { Link } from 'react-router-dom';
import { useLevelContext } from '../context/useContexts';

/**
 * Level 3 completion screen.
 * 
 * @returns {React.ReactNode} The Level3OutroPage component.`
 */
const Level3OutroPage = () => {
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

export default Level3OutroPage;
