import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { EightBitButton } from '../components/EightBit';
import { Page } from '../components/Page';
import { Image } from '../components/Image';

import backgroundUrl from '../images/pages/leaderboard.svg';
import heading from '../images/text/leaderboard.svg?metadata';

import '../css/pages/leaderboard-page.css';

/**
 * Returns an ordinal suffix (st, nd, rd, th) for a positive integer.
 */
const getOrdinal = (n) => {
	const mod100 = n % 100;
	if (mod100 >= 11 && mod100 <= 13) {
		return `${n}th`;
	}
	switch (n % 10) {
		case 1:
			return `${n}st`;
		case 2:
			return `${n}nd`;
		case 3:
			return `${n}rd`;
		default:
			return `${n}th`;
	}
};

/**
 * Leaderboard page.
 */
const LeaderboardPage = () => {
	const navigate = useNavigate();
	const max = 10;
	const [leaderboard, setLeaderboard] = useState(Array(max).fill({ user: '', score: 0 }));
	const { api } = window.sr;
	useEffect(() => {
		fetch(`${api}shelf-runner/v1/leaderboard/`, { cache: 'no-store' })
			.then((resp) => resp.json())
			.then((response) => {
				setLeaderboard(response.data);
			})
			.catch((error) => {
				console.error('Error fetching leaderboard:', error);
			});
	}, [api]);
	return (
		<Page className="sr-page--leaderboard" style={{ '--sr-bg-image': `url(${backgroundUrl})` }} fullWidth={true}>
			<h1 className="sr-page__heading">
				<Image {...heading} alt="Leaderboard" />
			</h1>
			<ul className="sr-leaderboard">
				{leaderboard.map((entry, index) => (
					<li key={index} className="sr-leaderboard__item">
						<span className="sr-leaderboard__cell sr-leaderboard__cell--rank">{getOrdinal(index + 1)}</span>
						<span className="sr-leaderboard__cell sr-leaderboard__clell--user">{entry.user || '_____'}</span>
						<span className="sr-leaderboard__cell sr-leaderboard__sclell--score">{entry.score}</span>
					</li>
				))}
			</ul>
			<div className="sr-page__button">
				<EightBitButton
					label={'Play Again'}
					onClick={() => navigate('/restart')}
				/>
			</div>
		</Page>
	);
};

export default LeaderboardPage;