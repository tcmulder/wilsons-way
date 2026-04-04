import { useEffect } from 'react';
import { useTimedNavigation } from '../hooks/useTimedNavigation';
import Message from '../components/Message';
import Page from '../components/Page';
import { EightBit, EightBitPill } from '../components/EightBit';
import backgroundUrl from '../images/pages/page-bg-dark.svg';
import levelHeadingUrl from '../images/text/level-1.svg';

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
		<Page style={{ '--sr-bg-image': `url(${backgroundUrl})` }} className="sr-page--intro">
			<h1 className="sr-page__heading">
				<img src={levelHeadingUrl} alt={`Level ${levelNumber} Heading`} />
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

export default Level1IntroPage;
