import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTimedNavigation } from '../hooks/useTimedNavigation';

import { EightBitButton } from '../components/EightBit';
import { Image } from '../components/Image';
import { Message } from '../components/Message';
import { Page } from '../components/Page';

import backgroundUrl from '../images/pages/page-bg-dark.svg';
import gameOverHeading from '../images/text/game-over.svg?metadata';

import '../css/pages/game-over-page.css';

/**
 * Game over screen.
 * 
 * @returns {React.ReactNode} The GameOverPage component.`
 */
const GameOverPage = () => {
	const navigate = useNavigate();
	const { timedNavigate } = useTimedNavigation();
	useEffect(() => {
		timedNavigate({ route: '/restart', delay: 5000 });
	}, [timedNavigate]);
	return (
		<Page style={{ '--sr-bg-image': `url(${backgroundUrl})` }} className="sr-page--game-over">
			<h1 className="sr-page__heading">
				<Image {...gameOverHeading} alt={'Game Over'} />
			</h1>
			<Message messageKey={'loser'} />
			<div className="sr-page__button">
				<EightBitButton
					label={'Try Again'}
					onClick={() => navigate('/restart')}
				/>
			</div>
		</Page>
	);
};

export default GameOverPage;