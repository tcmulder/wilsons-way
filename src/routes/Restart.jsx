import { useEffect } from 'react';

/**
 * Restart the game (and lose all progress/state)
 */
const RestartPage = () => {
	useEffect(() => {
		setTimeout(() => {
			window.location.reload();
		}, 1000);
	}, []);
	return (
		<div>
			<h1>Restarting...</h1>
		</div>
	);
};

export default RestartPage;