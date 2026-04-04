import { useEffect } from 'react';
import { useTimedNavigation } from '../hooks/useTimedNavigation';
import Message from '../components/Message';

/**
 * Level 3 introduction screen.
 * 
 * @returns {React.ReactNode} The Level3IntroPage component.`
 */
const Level3IntroPage = () => {
	const levelNumber = 3;
	const { timedNavigate } = useTimedNavigation();
	useEffect(() => {
		timedNavigate({ route: `/level/${levelNumber}`, delay: 3000 });
	}, [levelNumber, timedNavigate]);
	return (
		<div>
			<h1>Level {levelNumber} Intro</h1>
			<Message messageKey={`level_${levelNumber}_intro`} />
		</div>
	);
};

export default Level3IntroPage;
