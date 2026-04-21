import { useEffect } from 'react';

import { Page } from '../components/Page';
import { Score } from '../components/Score';
import { useScoreContext } from '../context/useContexts';
import { useTimedNavigation } from '../hooks/useTimedNavigation';

import backgroundUrl from '../images/pages/page-bg-dark.svg';

/**
 * Level 4 score screen.
 *
 * @returns {React.ReactNode} The Level4ScorePage component.
 */
const Level4ScorePage = () => {
	const levelNumber = 4;
	const { score } = useScoreContext();
	const { api } = window.sr;
	const { timedNavigate } = useTimedNavigation();

	// Navigate to either the high score form (if earned) or the leaderboard.
	useEffect(() => {
		fetch(`${api}shelf-runner/v1/leaderboard/`, { cache: 'no-store' })
			.then((resp) => resp.json())
			.then((response) => {
				const userScore = score?.reduce((sum, entry) => sum + (Number(entry?.num) || 0), 0) ?? 0;
				const highScores = response.data ?? [];
				const isHighScore = highScores.some((e) => userScore >= e.score);
				if (isHighScore) {
					timedNavigate({ route: `/form`, delay: 3000 });
				} else {
					timedNavigate({ route: `/leaderboard`, delay: 3000 });
				}
			});
	}, [score, api, timedNavigate]);
	return (
		<Page style={{ '--sr-bg-image': `url(${backgroundUrl})` }} className="sr-page--score">
			<Score levelNumber={levelNumber} />
		</Page>
	);
};

export default Level4ScorePage;
