/**
 * Submit high score form data
 */
export const submitHighScore = async (props) => {
	console.log('🤞', props);
	const {
		e,
		score,
		user,
		navigate,
		debug,
		api,
		nonce,
	} = props;
	e.preventDefault();
	const isDebugMode = !!debug;
	return fetch(`${api}shelf-runner/v1/winner/`, {
		method: 'POST',
		headers: {
			'X-WP-Nonce': nonce,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({ user, score, isDebugMode }),
		credentials: 'same-origin',
	})
		.then((resp) => resp.json())
		.then((response) => {
			if (response?.data?.status === 200) {
				if (isDebugMode) {
					alert('Note: debug mode is active, so your score will not be saved.');
					// eslint-disable-next-line no-console
					console.log(response.data);
				}
				navigate('/leaderboard');
				return true;
			}
			console.error('Error', response);
			return false;
		});
};