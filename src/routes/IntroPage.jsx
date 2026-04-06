import { useNavigate } from 'react-router-dom';

import { EightBit, EightBitPill } from '../components/EightBit';
import { Image } from '../components/Image';
import { Page } from '../components/Page';
import { useSettingsContext } from '../context/useContexts';
import { useGameAudio } from '../hooks/useSFX';

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

				<label>
					<input
						type="checkbox"
						id="music"
						checked={makeMusic}
						onChange={(e) => setMakeMusic(e.target.checked)}
						aria-label={`Music is ${makeMusic ? 'on' : 'off'}`}
					/>
					<span>Music</span>
				</label>

				<EightBit bg={<EightBitPill />}>
					<button onClick={() => navigate('/level/1')}>Start Game</button>
				</EightBit>

				<label>
					<input
						type="checkbox"
						id="sounds"
						checked={makeSFX}
						onChange={(e) => setMakeSFX(e.target.checked)}
						aria-label={`SFX is ${makeSFX ? 'on' : 'off'}`}
					/>
					<span>Sound Effects</span>
				</label>

			</div>
			<Image {...wilson} className="sr-page__wilson" alt="Wilson" />
		</Page>
	);
};

export default IntroPage;