import { useEffect } from 'react';
import { useTimedNavigation } from '../hooks/useTimedNavigation';

/**
 * Level 2 score screen.
 *
 * @returns {React.ReactNode} The Level2ScorePage component.
 */
const Level2ScorePage = () => {
	const levelNumber = 2;
	const { timedNavigate } = useTimedNavigation();
	useEffect(() => {
		timedNavigate({ route: `/level/${levelNumber}/transition`, delay: 3000 });
	}, [levelNumber, timedNavigate]);
	return (
		<div>
			<h1>Level {levelNumber} Score</h1>
		</div>
	);
};

export default Level2ScorePage;
