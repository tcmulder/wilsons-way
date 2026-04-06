import { useEffect } from 'react';

import Message from '../components/Message';
import { Page } from '../components/Page';
import { useTimedNavigation } from '../hooks/useTimedNavigation';

/**
 * Page if you lost all your lives
 */
const LostPage = () => {
	const { timedNavigate } = useTimedNavigation();
	useEffect(() => {
		timedNavigate({ route: '/restart', delay: 3000 });
	}, [timedNavigate]);
	return (
		<Page>
			<h1>Battery Depleted</h1>
			<Message messageKey="loser" />
		</Page>
	);
};

export default LostPage;