import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTimedNavigation } from '../hooks/useTimedNavigation';

import { Image } from '../components/Image';
import { EightBitButton } from '../components/EightBit';
import { Page } from '../components/Page';
import { Message } from '../components/Message';
import { Fireworks } from '../components/Fireworks';

import heading from '../images/text/you-won.svg?metadata';

/**
 * Level 2 completion screen.
 *
 * @returns {React.ReactNode} The Level2OutroPage component.
 */
const OutroPage = () => {
	const navigate = useNavigate();
	const { timedNavigate } = useTimedNavigation();

	// Auto-navigate to outro page
	useEffect(() => {
		timedNavigate({ route: '/leaderboard', delay: 3500 });
	}, [timedNavigate]);

	return (
		<Page>
			<Fireworks />
			<h1 className="sr-page__heading">
				<Image {...heading} alt="You Won!" />
			</h1>
			<Message messageKey={'outro'} alignCenter />
			<EightBitButton
				className="sr-8bit--br"
				label="Skip"
				onClick={() => navigate('/leaderboard')}
			/>
		</Page>
	);
};

export default OutroPage;
