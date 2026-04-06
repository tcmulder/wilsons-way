import { useEffect } from 'react';

import { Page } from '../components/Page';
import { useScoreContext } from '../context/useContexts';
import { useTimedNavigation } from '../hooks/useTimedNavigation';

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
	useEffect(() => {
		fetch(`${api}shelf-runner/v1/leaderboard/`)
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
		<Page>
			<h1>Level {levelNumber} Score</h1>
		</Page>
	);
};

export default Level4ScorePage;
