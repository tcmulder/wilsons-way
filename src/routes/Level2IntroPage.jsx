import { useEffect } from 'react';
import { useTimedNavigation } from '../hooks/useTimedNavigation';
import Message from '../components/Message';
import Page from '../components/Page';

/**
 * Level 2 introduction screen.
 * 
 * @returns {React.ReactNode} The Level2IntroPage component.`
 */
const Level2IntroPage = () => {
	const levelNumber = 2;
	const { timedNavigate } = useTimedNavigation();
	useEffect(() => {
		timedNavigate({ route: `/level/${levelNumber}`, delay: 3000 });
	}, [levelNumber, timedNavigate]);
	return (
		<Page>
			<h1>Level {levelNumber} Intro</h1>
			<Message messageKey={`level_${levelNumber}_intro`} />
		</Page>
	);
};

export default Level2IntroPage;
