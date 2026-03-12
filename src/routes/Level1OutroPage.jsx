import { useEffect } from 'react';
import { useTimedNavigation } from '../hooks/useTimedNavigation';
import Message from '../components/Message';

/**
 * Level 1 completion screen.
 * 
 * @returns {React.ReactNode} The Level1OutroPage component.`
 */
const Level1OutroPage = () => {
	const { timedNavigate } = useTimedNavigation();
	useEffect(() => {
		timedNavigate({ route: '/level/1/transition', delay: 3000 });
	}, [timedNavigate]);
	return (
		<div>
			<h1>Level 1 Outro</h1>
			<Message messageKey="level_1_outro" />
		</div>
	);
};

export default Level1OutroPage;
