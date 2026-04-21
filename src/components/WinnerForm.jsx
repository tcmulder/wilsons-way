import { useEffect, useMemo, useState } from 'react';
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
	const [team, setTeam] = useState('');
	const [total, setTotal] = useState(score?.reduce((sum, entry) => sum + (Number(entry?.num) || 0), 0) || 0);
	const navigate = useNavigate();
	const isDebugMode = !!debug;
	const [teamNamesRaw, setTeamNamesRaw] = useState('');
	const [teamNamesReady, setTeamNamesReady] = useState(false);

	useEffect(() => {
		let cancelled = false;
		fetch(`${api}shelf-runner/v1/message/team_names`)
			.then((response) => response.json())
			.then((data) => {
				if (!cancelled) {
					setTeamNamesRaw(data?.data?.value ?? '');
				}
			})
			.catch((error) => {
				console.error('Failed to fetch team names:', error);
			})
			.finally(() => {
				if (!cancelled) {
					setTeamNamesReady(true);
				}
			});
		return () => {
			cancelled = true;
		};
	}, [api]);

	const teamOptions = useMemo(
		() =>
			teamNamesRaw
				.split(/\r?\n/)
				.map((line) => line.trim())
				.filter(Boolean),
		[teamNamesRaw]
	);
	const teamSelectDisabled = !teamNamesReady || teamOptions.length === 0;
	const teamPlaceholder = !teamNamesReady
		? 'Loading…'
		: teamOptions.length > 0
			? 'Select team'
			: 'No teams configured';

	return (
		<form
			className="sr-winner-form"
			onSubmit={(e) => submitHighScore({
				e,
				score: total,
				user,
				team,
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
			<label>	<span>Choose Team:</span>
				<select
					name="team"
					value={team}
					onChange={(e) => setTeam(e.target.value)}
					required={teamNamesReady && teamOptions.length > 0}
					disabled={teamSelectDisabled}
				>
					<option value="">{teamPlaceholder}</option>
					{teamOptions.map((name, i) => (
						<option key={`${name}-${i}`} value={name}>
							{name}
						</option>
					))}
				</select>
			</label>
			<div className="sr-winner-form__button">
				<EightBitButton
					label={'Next'}
					type="submit"
					disabled={!user || !team}
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
