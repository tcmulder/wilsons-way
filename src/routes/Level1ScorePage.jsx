import { useEffect } from 'react';
import Page from '../components/Page';
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
		<Page>
			<h1>Level {levelNumber} Score</h1>
		</Page>
	);
};

export default Level1ScorePage;
