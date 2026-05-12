import { Message } from '../components/Message';
import { Page } from '../components/Page';
import { Image } from '../components/Image';
import { WinnerForm } from '../components/WinnerForm';
import { Fireworks } from '../components/Fireworks';

import heading from '../images/text/you-won.svg?metadata';

import '../css/pages/high-score-page.css';

/**
 * Intro page
 */
const HighScorePage = () => {
	return (
		<Page className="sr-page--high-score">
			<Fireworks />
			<div className="sr-page__request">
				<h1 className="sr-page__heading">
					<Image {...heading} alt="You Won!" />
				</h1>
				<Message messageKey="winner" alignCenter />
				<WinnerForm />
			</div>
		</Page>
	);
};

export default HighScorePage;