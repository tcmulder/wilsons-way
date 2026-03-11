import { useEffect } from 'react';
import { useTimedNavigation } from '../hooks/useTimedNavigation';
import Message from '../components/Message';

/**
 * Page if you lost all your lives
 */
const LostPage = () => {
	const { timedNavigate } = useTimedNavigation();
	useEffect(() => {
		timedNavigate({ route: '/restart', delay: 3000 });
	}, [timedNavigate]);
	return (
		<div>
			<h1>Battery Depleted</h1>
			<Message messageKey="loser" />
		</div>
	);
};

export default LostPage;