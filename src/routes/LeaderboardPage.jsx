import { useEffect, useState } from 'react';
import '../css/leaderboard.css';

/**
 * Leaderboard page.
 */
const LeaderboardPage = () => {
	const max = 10;
	const [leaderboard, setLeaderboard] = useState(Array(max).fill({ user: '', score: 0 }));
	const { api } = window.sr;
	useEffect(() => {
		fetch(`${api}shelf-runner/v1/leaderboard/`)
			.then((resp) => resp.json())
			.then((response) => {
				setLeaderboard(response.data);
			})
			.catch((error) => {
				console.error('Error fetching leaderboard:', error);
			});
	});
	return (
		<div className="sr-leaderboard">
			<h1>Leaderboard</h1>
			<ul className="sr-leaderboard__list">
				{leaderboard.map((entry, index) => (
					<li key={index} className="sr-leaderboard__item">
						<span className="sr-leaderboard__user">{entry.user || '_____'}</span>
						<span className="sr-leaderboard__score">{entry.score}</span>
					</li>
				))}
			</ul>
		</div>
	);
};

export default LeaderboardPage;