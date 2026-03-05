import { useEffect } from 'react';
import { useTimedNavigation } from '../hooks/useTimedNavigation';
/**
 * Page if you lost all your lives
 */
const LostPage = () => {
	const timedNavigate = useTimedNavigation();
	useEffect(() => {
		timedNavigate({ route: '/restart', delay: 3000 });
	}, [timedNavigate]);
	return (
		<div>
			<h1>Battery Depleted</h1>
			<p>You're not a loser. You tried. You're a failure.</p>
		</div>
	);
};

export default LostPage;