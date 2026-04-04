import { useEffect } from 'react';
import { useTimedNavigation } from '../hooks/useTimedNavigation';

/**
 * Level 1 score screen.
 * 
 * @returns {React.ReactNode} The Level1ScorePage component.`
 */
const Level1ScorePage = () => {
	const levelNumber = 1;
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

export default Level1ScorePage;
