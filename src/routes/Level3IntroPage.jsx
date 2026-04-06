import { useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import { Page } from '../components/Page';
import { EightBit, EightBitPill } from '../components/EightBit';
import backgroundUrl from '../images/pages/page-bg-dark.svg';
import levelHeading from '../images/text/level-3.svg?metadata';
import { Image } from '../components/Image';

/**
 * Level 3 introduction screen.
 *
 * @returns {React.ReactNode} The Level3IntroPage component.`
 */
const Level3IntroPage = () => {
	const levelNumber = 3;
	const navigate = useNavigate();
	return (
		<Page style={{ '--sr-bg-image': `url(${backgroundUrl})` }} className="sr-page--level-intro">
			<h1 className="sr-page__heading">
				<Image {...levelHeading} alt={`Level ${levelNumber} Heading`} />
			</h1>
			<Message messageKey={`level_${levelNumber}_intro`} />
			<div className="sr-page__button">
				<EightBit bg={<EightBitPill />}>
					<button onClick={() => navigate(`/level/${levelNumber}`)}>Start Level {levelNumber}</button>
				</EightBit>
			</div>
		</Page>
	);
};

export default Level3IntroPage;
