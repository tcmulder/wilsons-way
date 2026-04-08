import { useNavigate } from 'react-router-dom';

import { useSettingsContext } from '../context/useContexts';
import { useGameAudio } from '../hooks/useSFX';

import { Image } from '../components/Image';
import { Page } from '../components/Page';
import { EightBitButton, EightBitToggle } from '../components/EightBit';

import logo from '../images/baired-logo.svg?metadata';
import backgroundUrl from '../images/pages/page-bg-light.svg';
import heading from '../images/text/baird-quest.svg?metadata';
import wilson from '../images/wilson.svg?metadata';

import '../css/pages/intro-page.css';

/**
 * Intro page
 */
const IntroPage = () => {
	const navigate = useNavigate();
	const { makeMusic, makeSFX, setMakeMusic, setMakeSFX } = useSettingsContext();
	useGameAudio();
	return (
		<Page className="sr-page--intro" style={{ '--sr-bg-image': `url(${backgroundUrl})` }}>
			
			<Image {...logo} className="sr-page__logo" alt="Baird Company Logo" />
			
			<h1 className="sr-page__heading">
				<Image {...heading} alt="Baird Quest" />
			</h1>
			
			<div className="sr-page__controls">

				<EightBitToggle
					label={`Music is ${makeMusic ? 'on' : 'off'}`}
					value={makeMusic}
					onChange={(e) => setMakeMusic(e.target.checked)}
				/>

				<EightBitButton
					label="Start Game"
					onClick={() => navigate('/level/1')}
				/>

				<EightBitToggle
					label={`Sound Effects is ${makeSFX ? 'on' : 'off'}`}
					value={makeSFX}
					onChange={(e) => setMakeSFX(e.target.checked)}
				/>

			</div>
			<Image {...wilson} className="sr-page__wilson" alt="Wilson" />
		</Page>
	);
};

export default IntroPage;