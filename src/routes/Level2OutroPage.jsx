import { useEffect } from 'react';
import { useTimedNavigation } from '../hooks/useTimedNavigation';
import Message from '../components/Message';

/**
 * Level 2 completion screen.
 * 
 * @returns {React.ReactNode} The Level2OutroPage component.`
 */
const Level2OutroPage = () => {
	const { timedNavigate } = useTimedNavigation();
	useEffect(() => {
		timedNavigate({ route: '/level/2', delay: 3000 });
	}, [timedNavigate]);
	return (
		<div>
			<h1>Level 2 Outro</h1>
			<Message messageKey="level_2_outro" />
		</div>
	);
};

export default Level2OutroPage;
