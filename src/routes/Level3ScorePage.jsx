import { useEffect } from 'react';
import Page from '../components/Page';
import { useTimedNavigation } from '../hooks/useTimedNavigation';

/**
 * Level 3 score screen.
 *
 * @returns {React.ReactNode} The Level3ScorePage component.
 */
const Level3ScorePage = () => {
	const levelNumber = 3;
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

export default Level3ScorePage;
