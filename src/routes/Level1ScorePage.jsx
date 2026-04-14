import { useEffect } from 'react';

import { Page } from '../components/Page';
import { Score } from '../components/Score';
import { useTimedNavigation } from '../hooks/useTimedNavigation';

import backgroundUrl from '../images/pages/page-bg-dark.svg';

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
		<Page style={{ '--sr-bg-image': `url(${backgroundUrl})` }} className="sr-page--score">
			<Score levelNumber={levelNumber} />
		</Page>
	);
};

export default Level1ScorePage;
