import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useScoreContext } from '../context/useContexts';
import Message from '../components/Message';

/**
 * Level 4 completion screen.
 */
const Level4OutroPage = () => {
	const { score } = useScoreContext();
	const { api } = window.sr;
	const [isHighScore, setIsHighScore] = useState(false);
	useEffect(() => {
		fetch(`${api}shelf-runner/v1/leaderboard/`)
			.then((resp) => resp.json())
			.then((response) => {
				const userScore = score?.reduce((sum, entry) => sum + (Number(entry?.num) || 0), 0) ?? 0;
				const highScores = response.data ?? [];
				const isHighScore = highScores.some((e) => userScore >= e.score);
				setIsHighScore(isHighScore);
			});
	}, [score, api]);
	return (
		<div>
			<h1>Level 4 Outro</h1>
			<Message messageKey="level_4_outro" />
			{!isHighScore ? <Link to="/leaderboard">View Leaderboard</Link> : <Link to="/form">Submit High Score</Link>}
		</div>
	);
};

export default Level4OutroPage;
