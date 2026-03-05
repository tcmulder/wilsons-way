import { useNavigate } from 'react-router-dom';
import { EightBit } from '../components/EightBit';
import { EightBitPill } from '../components/EightBit';
import { useSettingsContext } from '../context/useContexts';
import { useGameAudio } from '../hooks/useSFX';

/**
 * Intro page
 */
const IntroPage = () => {
	const navigate = useNavigate();
	const { makeMusic, makeSFX, setMakeMusic, setMakeSFX } = useSettingsContext();
	useGameAudio();
	return (
		<div>
			<h1>Welcome to the Game</h1>
			<p>This is an introductory page, and content is TBD.</p>
			<div style={{width: '10cqmax'}}>
				<EightBit bg={<EightBitPill />}>
					<button onClick={() => navigate('/level/1')}>Start Game</button>
				</EightBit>
			</div>
			<div style={{width: '10cqmax'}}>
				<EightBit bg={<EightBitPill />}>
					<button onClick={() => window.location.href = 'http://localhost:5173/?debug=true&autoplay=false&router=true&userAdjustedLives=10&userAdjustedMilestone=176#/level/1'}>Debug</button>
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
		</div>
	);
};

export default IntroPage;