import { useEffect } from 'react';
import { useTimedNavigation } from '../hooks/useTimedNavigation';
import Message from '../components/Message';

/**
 * Level 3 completion screen.
 * 
 * @returns {React.ReactNode} The Level3OutroPage component.`
 */
const Level3OutroPage = () => {
	const { timedNavigate } = useTimedNavigation();
	useEffect(() => {
		timedNavigate({ route: '/level/4', delay: 3000 });
	}, [timedNavigate]);
	return (
		<div>
			<h1>Level 3 Outro</h1>
			<Message messageKey="level_3_outro" />
		</div>
	);
};

export default Level3OutroPage;
