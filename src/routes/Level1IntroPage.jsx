import { useEffect } from 'react';
import { useTimedNavigation } from '../hooks/useTimedNavigation';
import Message from '../components/Message';
import Page from '../components/Page';
import backgroundUrl from '../images/pages/page-bg-dark.svg';

/**
 * Level 1 introduction screen.
 * 
 * @returns {React.ReactNode} The Level1IntroPage component.`
 */
const Level1IntroPage = () => {
	const levelNumber = 1;
	const { timedNavigate } = useTimedNavigation();
	useEffect(() => {
		timedNavigate({ route: `/level/${levelNumber}`, delay: 3000 });
	}, [levelNumber, timedNavigate]);
	return (
		<Page style={{ backgroundImage: `url(${backgroundUrl})` }}>
			<h1>Level {levelNumber} Intro</h1>
			<Message messageKey={`level_${levelNumber}_intro`} />
		</Page>
	);
};

export default Level1IntroPage;
