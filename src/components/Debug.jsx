import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDebugContext, useSettingsContext, useLevelContext, useCharacterContext } from '../context/useContexts';
import { routes } from '../routes';

import '../css/debug.css';

const setStateAndQuery = (key, value, setState) => {
	setState(value);
	const url = new URL(window.location.href);
	url.searchParams.set(key, value);
	window.history.pushState({}, '', url);
};

/**
 * Checkbox selector
 */
const DebugCheckbox = ({ label, param = '', value, setValue, title = '' }) => {
	const k = param || label.toLowerCase();
	return (
		<label title={title}>
			<span>{label}</span>
			<input type="checkbox" checked={value} onChange={(e) => setStateAndQuery(k, e.target.checked, setValue)} />
		</label>
	);
};

/**
 * Number selector
 */
const DebugNumber = ({ label, param = '', value, setValue, title = '' }) => {
	const k = param || label.toLowerCase();
	return (
		<label title={title}>
			<span>{label}</span>
			<input
				type="number"
				value={value}
				onChange={(e) => setStateAndQuery(k, parseFloat(e.target.value), setValue)}
				onKeyDown={(e) => e.stopPropagation()}
			/>
		</label>
	);
};

/**
 * Apply debug settings (usually from query string on page load)
 * 
 * @param {Object} props The properties object
 * @param {Object} props.debug The debug object
 * @param {Object} props.settings The settings object
 * @param {Function} props.setLevel The function to set the level
 * @param {Function} props.setCharacterId The function to set the character id
 * @returns {void}
 */
const useDebug = ({debug, settings, setLevel, setCharacterId}) => {
	useEffect(() => {
		if (settings.debugAllowed && debug) {
			if (debug?.level) {
				setLevel(parseInt(debug.level));
			}
			if (debug?.characterId) {
				setCharacterId(parseInt(debug.characterId));
			}
		}
	}, [debug, setLevel, setCharacterId, settings.debugAllowed]);
};

export const Debug = () => {
	const { debug, setDebug } = useDebugContext();
	const { settings } = useSettingsContext();
	const { level, setLevel } = useLevelContext();
	const { characterId, setCharacterId } = useCharacterContext();
	const navigate = useNavigate();
	const pagePath = useLocation().pathname;
	
	// Setup menu open/close state
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// Apply debug settings from state
	useDebug({debug, setLevel, setCharacterId, settings});
	
	// Bail if debug is not allowed or enabled
	if (!settings.debugAllowed || !debug) {
		return null;
	}
	
	return (
		<div className={`sr-debug${debug?.outlines ? ' sr-debug--outlines' : ''}`}>
			<button onClick={(e) => { e.preventDefault(); setIsMenuOpen(!isMenuOpen); }}>🐞 Debug</button>
			{isMenuOpen && (
				<div className="sr-debug__menu">
					<DebugNumber
						label="🧱 Level"
						param="level"
						value={level}
						setValue={setLevel}
					/>
					<DebugNumber
						label="🦸 Character"
						param="characterId"
						value={characterId}
						setValue={setCharacterId}
					/>
					<DebugCheckbox
						label="🚷 Autoplay"
						param="autoplay"
						value={debug?.autoplay}
						setValue={(val) => setDebug({ ...debug, autoplay: val })}
						title="Automatically play the game when the level loads"
					/>
					<DebugCheckbox
						label="🔀 Router"
						param="router"
						value={debug?.router}
						setValue={(val) => setDebug({ ...debug, router: val })}
						title="Exposes the URL path so you can refresh without going back to the start"
					/>
					<DebugCheckbox
						label="👁️ Outlines"
						param="outlines"
						value={debug?.outlines}
						setValue={(val) => setDebug({ ...debug, outlines: val })}
						title={[
							// unused: 🟧🟦🟪🟫⬛
							'⬜ level boundary',
							'🟨 crash area',
							'🟩 positive',
							'🟥 negative',
						].join('\n')}
					/>
					<select value={pagePath} onChange={(e) => { e.preventDefault(); navigate(e.target.value); }}>
						{routes.map(({ path, title }) => (
							<option key={path} value={path}>Page: {title}</option>
						))}
					</select>
					<button onClick={(e) => { e.preventDefault(); window.location.reload(); }}>🔄 restart</button>
				</div>
			)}
		</div>
	);
};