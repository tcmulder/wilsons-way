import { useEffect } from 'react';

import { Page } from '../components/Page';
import { Score } from '../components/Score';
import { useTimedNavigation } from '../hooks/useTimedNavigation';

import backgroundUrl from '../images/pages/page-bg-dark.svg';

/**
 * Level 3 score screen.
 *
 * @returns {React.ReactNode} The Level3ScorePage component.
 */
const Level3ScorePage = () => {
	const levelNumber = 3;
	const { timedNavigate } = useTimedNavigation();
	
	useEffect(() => {
		timedNavigate({ route: `/level/${levelNumber}/transition`, delay: 6000 });
	}, [levelNumber, timedNavigate]);
	
	return (
		<Page style={{ '--sr-bg-image': `url(${backgroundUrl})` }} className="sr-page--score">
			<Score levelNumber={levelNumber} />
		</Page>
	);
};

export default Level3ScorePage;
