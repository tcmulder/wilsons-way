import { useNavigate } from 'react-router-dom';
import { useSettingsContext } from '../context/useContexts';

/**
 * Intro page
 */
const IntroPage = () => {
	const navigate = useNavigate();
	const { makeMusic, makeSFX, setMakeMusic, setMakeSFX } = useSettingsContext();
	return (
		<div>
			<h1>Welcome to the Game</h1>
			<p>This is an introductory page, and content is TBD.</p>
			<button style={{fontSize: '7em'}} onClick={() => navigate('/gameplay')}>Start Game</button>
			<div className="foobar">[FULL WIDTH]</div>
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
			<br />
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
	);
};

export default IntroPage;