import { useEffect } from 'react';
import { useLevelContext } from '../context/useContexts';
import { Link } from 'react-router-dom';

const Level2OutroPage = () => {
	const { level, setLevel, setIsLevelComplete } = useLevelContext();

	useEffect(() => {
		setIsLevelComplete(false);
	}, [setIsLevelComplete]);

	return (
		<div>
			<h2>You've completed Level 2!</h2>
			<Link
				to="/gameplay"
				onClick={() => setLevel(level + 1)}
				>
					Next Level &gt;&gt;
			</Link>
		</div>
	);
};

export default Level2OutroPage;