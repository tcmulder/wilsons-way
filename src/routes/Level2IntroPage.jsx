import { useNavigate } from 'react-router-dom';

import { EightBitButton } from '../components/EightBit';
import { Image } from '../components/Image';
import { Message } from '../components/Message';
import { Page } from '../components/Page';

import backgroundUrl from '../images/pages/page-bg-dark.svg';
import levelHeading from '../images/text/level-2.svg?metadata';

/**
 * Level 2 introduction screen.
 *
 * @returns {React.ReactNode} The Level2IntroPage component.`
 */
const Level2IntroPage = () => {
	const levelNumber = 2;
	const navigate = useNavigate();
	return (
		<Page style={{ '--sr-bg-image': `url(${backgroundUrl})` }} className="sr-page--level-intro">
			<h1 className="sr-page__heading">
				<Image {...levelHeading} alt={`Level ${levelNumber} Heading`} />
			</h1>
			<Message messageKey={`level_${levelNumber}_intro`} />
			<div className="sr-page__button">
				<EightBitButton
					label={`Start Level ${levelNumber}`}
					onClick={() => navigate(`/level/${levelNumber}`)}
				/>
			</div>
		</Page>
	);
};

export default Level2IntroPage;
