import { state } from './state';
import { setMessage } from './messages';

/**
 * Show temporary leaderboard on intro screen
 */
export const showLeaderboard = async () => {
	// Load any new leaderboard data
	await setLeaderboard();
	// Prep timer to reset leaderboard if inactive for a while
	clearTimeout(state.timer);
	state.timer = setTimeout(async () => {
		setMessage('intro');
	}, state.delayInactive);
	// Show the leaderboard message
	await setMessage('leaderboard');
	// After closing the message cancel the reset timer
	clearTimeout(state.timer);
	// Go back to intro on close
	setMessage('intro');
};

/**
 * Get score leaderboard
 */
export const getLeaderboard = async () => {
	const {
		wp: { api },
	} = state;
	return fetch(`${api}shelf-runner/v1/leaderboard/`, {
		method: 'GET',
		credentials: 'same-origin',
	})
		.then((resp) => resp.json())
		.then((response) => {
			if (response?.status === 200) {
				return response.data;
			}
			// eslint-disable-next-line no-console
			console.error('Error', response);
			return false;
		});
};

/**
 * Setup the score leaderaboard
 */
export const setLeaderboard = async () => {
	const { elLeaderboardScores } = state;
	const leaderboard = await getLeaderboard();
	if (leaderboard) {
		elLeaderboardScores.forEach((elScore, i) => {
			let user = 'XXXXXX';
			let score = 'XXXXXX';
			if (leaderboard[i]) {
				user = leaderboard[i].user;
				score = leaderboard[i].score.toLocaleString('en-US');
			}
			const elNth = elScore.firstElementChild;
			elNth.nextElementSibling.textContent = user;
			elNth.nextElementSibling.nextElementSibling.textContent = score;
		});
	}
};
