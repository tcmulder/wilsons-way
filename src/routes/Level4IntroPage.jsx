import { useNavigate } from 'react-router-dom';

import { useMusicTrack } from '../hooks/useMusicTrack';

import { AssetPreload } from '../components/AssetPreload';
import { EightBitButton } from '../components/EightBit';
import { Image } from '../components/Image';
import { Message } from '../components/Message';
import { Page } from '../components/Page';

import backgroundUrl from '../images/pages/page-bg-dark.svg';
import levelHeading from '../images/text/level-4.svg?metadata';

/**
 * Level 4 introduction screen.
 *
 * @returns {React.ReactNode} The Level4IntroPage component.`
 */
const Level4IntroPage = () => {
	useMusicTrack('level-4');
	const levelNumber = 4;
	const navigate = useNavigate();
	return (
		<Page style={{ '--sr-bg-image': `url(${backgroundUrl})` }} className="sr-page--level-intro">
			<AssetPreload
				assetPaths={[
					`public/svg/level-${levelNumber}.svg?v={version}`,
					'public/svg/character-3.svg?v={version}',
				]}
			/>
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

export default Level4IntroPage;
