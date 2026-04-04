import { useEffect } from 'react';
import { useTimedNavigation } from '../hooks/useTimedNavigation';

/**
 * Level 4 score screen.
 *
 * @returns {React.ReactNode} The Level4ScorePage component.
 */
const Level4ScorePage = () => {
	const levelNumber = 4;
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

export default Level4ScorePage;
