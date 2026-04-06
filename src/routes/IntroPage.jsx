import { useNavigate } from 'react-router-dom';
import { EightBit, EightBitPill } from '../components/EightBit';
import { useSettingsContext } from '../context/useContexts';
import { useGameAudio } from '../hooks/useSFX';
import { Page } from '../components/Page';
import backgroundUrl from '../images/pages/page-bg-light.svg';
import headingUrl from '../images/text/baird-quest.svg';
import logoUrl from '../images/baired-logo.svg';
import wilsonUrl from '../images/wilson.svg';

/**
 * Intro page
 */
const IntroPage = () => {
	const navigate = useNavigate();
	const { makeMusic, makeSFX, setMakeMusic, setMakeSFX } = useSettingsContext();
	useGameAudio();
	return (
		<Page className="sr-page--intro" style={{ '--sr-bg-image': `url(${backgroundUrl})` }}>
			
			<img className="sr-page__logo" src={logoUrl} alt="Baird Company Logo" />
			
			<h1 className="sr-page__heading">
				<img src={headingUrl} alt="Baird Quest" />
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
			<img className="sr-page__wilson" src={wilsonUrl} alt="Wilson" />
		</Page>
	);
};

export default IntroPage;