import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { submitHighScore } from '../util/doHighScore';
import { useScoreContext, useDebugContext } from '../context/useContexts';

/**
 * Intro page
 */
const HighScorePage = () => {
	const { debug } = useDebugContext();
	const { score } = useScoreContext();
	const { nonce, api } = window.sr;
	const [user, setUser] = useState('');
	const [total, setTotal] = useState(score?.reduce((sum, entry) => sum + (Number(entry?.num) || 0), 0) || 0);
	const navigate = useNavigate();
	const isDebugMode = !!debug;
	return (
		<div>
			<h1>You got a high score!</h1>
			<form
				onSubmit={(e) => submitHighScore({
					e,
					score: total,
					user,
					navigate,
					debug,
					api,
					nonce,
				})}>
				<label>	Your Name:
					<input
						type="text"
						name="name"
						value={user}
						onChange={(e) => setUser(e.target.value)}
						required
						minLength={3}
						maxLength={10}
					/>
				</label>
				<button type="submit">Submit</button>
				{isDebugMode && (
					<div style={{fontSize: '0.8em'}}>
						<label>
							<h2 style={{fontSize: '1.2em'}}>🐞 Debug mode is enabled.</h2>
							<p>What score would you like to submit for testing purposes? It will not be saved.</p>
							<input
								type="number"
								name="score"
								value={total}
								onChange={(e) => setTotal(e.target.value)}
								required
							/>
						</label>
					</div>
				)}
			</form>
		</div>
	);
};

export default HighScorePage;