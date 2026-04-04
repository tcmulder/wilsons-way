import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebugContext } from '../context/useContexts';

/**
 * Restart the game (and lose all progress/state)
 */
const RestartPage = () => {
	const { debug } = useDebugContext();
	const navigate = useNavigate();
	useEffect(() => {
		if (debug?.router) {
			navigate('/');
			console.error('🔄 Debug: refreshing a 2nd time to reset state');
		}
		setTimeout(() => {
			window.location.reload();
		}, 1000);
	}, [debug?.router, navigate]);
	return (
		<div>
			<h1>Restarting...</h1>
		</div>
	);
};

export default RestartPage;