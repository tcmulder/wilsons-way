import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '../components/Page';
import { useDebugContext } from '../context/useContexts';

/**
 * Restart the game (and lose all progress/state)
 */
const RestartPage = () => {
	const { debug } = useDebugContext();
	const navigate = useNavigate();
	useEffect(() => {
		if (debug?.slideshow === false) {
			console.error('🐜 Debug: cancelling restart timer');
			return;
		}
		if (debug?.router) {
			navigate('/');
			console.error('🔄 Debug: refreshing a 2nd time to reset state');
		}
		setTimeout(() => {
			window.location.reload();
		}, 1000);
	}, [debug?.router, debug?.slideshow, navigate]);
	return (
		<Page>
			<h1 style={{color: 'transparent'}}>Restarting...</h1>
		</Page>
	);
};

export default RestartPage;