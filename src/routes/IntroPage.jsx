import { useNavigate } from 'react-router-dom';
import { EightBit, EightBitPill } from '../components/EightBit';
import { useSettingsContext } from '../context/useContexts';
import { useGameAudio } from '../hooks/useSFX';
import { Page } from '../components/Page';
import headingUrl from '../images/text/baird-quest.svg';

/**
 * Intro page
 */
const IntroPage = () => {
	const navigate = useNavigate();
	const { makeMusic, makeSFX, setMakeMusic, setMakeSFX } = useSettingsContext();
	useGameAudio();
	return (
		<Page className="sr-page--intro">
			<h1>
				<img src={headingUrl} alt="Baird Quest" />
			</h1>
			<p>This is an introductory page, and content is TBD.</p>
			<div style={{width: '10cqmax'}}>
				<EightBit bg={<EightBitPill />}>
					<button onClick={() => navigate('/level/1')}>Start Game</button>
				</EightBit>
			</div>
			<div>
				<label>
					<input
						type="checkbox"
						id="music"
						checked={makeMusic}
						onChange={(e) => setMakeMusic(e.target.checked)}
						aria-label={`Music is ${makeMusic ? 'on' : 'off'}`}
					/>
					<span>Music is {makeMusic ? 'on' : 'off'}</span>
				</label>
			</div>
			<div>
				<label>
					<input
						type="checkbox"
						id="sounds"
						checked={makeSFX}
						onChange={(e) => setMakeSFX(e.target.checked)}
						aria-label={`SFX is ${makeSFX ? 'on' : 'off'}`}
					/>
					<span>SFX is {makeSFX ? 'on' : 'off'}</span>
				</label>
			</div>
		</Page>
	);
};

export default IntroPage;