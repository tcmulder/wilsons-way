import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { EightBitButton } from './EightBit';
import { useScoreContext, useDebugContext } from '../context/useContexts';
import { submitHighScore } from '../util/doHighScore';

import '../css/pages/winner-form.css';

export function WinnerForm() {
	const { debug } = useDebugContext();
	const { score } = useScoreContext();
	const { nonce, api } = window.sr;
	const [user, setUser] = useState('');
	const [total, setTotal] = useState(score?.reduce((sum, entry) => sum + (Number(entry?.num) || 0), 0) || 0);
	const navigate = useNavigate();
	const isDebugMode = !!debug;

	return (
		<form
			className="sr-winner-form"
			onSubmit={(e) => submitHighScore({
				e,
				score: total,
				user,
				navigate,
				debug,
				api,
				nonce,
			})}>
			<label>	<span>Enter Name:</span>
				<input
					type="text"
					name="name"
					value={user}
					onChange={(e) => setUser(e.target.value)}
					required
					minLength={2}
					maxLength={10}
				/>
			</label>
			<div className="sr-winner-form__button">
				<EightBitButton
					label={'Next'}
					type="submit"
					disabled={!user}
				/>
			</div>
			{isDebugMode && (
				<div className="sr-winner-form__debug">
					<label>
						<h2 style={{fontSize: '1.2em'}}>🐞 Debug enabled:</h2>
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
	);
}
