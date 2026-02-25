import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
	useDebugContext,
	useSettingsContext,
	useCharacterContext,
} from '../context/useContexts';
import { routes } from '../routes';
import { useDebugDropLevel } from '../hooks/useDebugDropLevel';

import '../css/debug.css';

/**
 * Set state and also update the URL (to preserve on refresh)
 * 
 * @param {Object} props The properties object
 * @param {string} props.key Param key to set
 * @param {any} props.value Value to set
 * @param {Function} props.setState Function to set the state
 */
const setStateAndQuery = (props) => {
	const { key, value, setState } = props;
	setState(value);
	const url = new URL(window.location.href);
	url.searchParams.set(key, value);
	window.history.pushState({}, '', url);
};

/**
 * Generic debug button.
 * 
 * @param {Object} props
 * @param {string} props.label Button text
 * @param {() => void} props.onClick Handler
 * @param {string} [props.title] Title/tooltip
 */
const DebugButton = ({ label, onClick, title = '' }) => {
	return (
		<button title={title} onClick={(e) => { e.preventDefault(); onClick(e); }}>
			{label}
		</button>
	);
};

/**
 * Checkbox selector.
 * 
 * @param {Object} props
 * @param {string} props.label Label text
 * @param {string} [props.param] URL param key (defaults to label lowercased)
 * @param {boolean} props.value Checked state
 * @param {(v: boolean) => void} props.setValue Setter (also pushes URL)
 * @param {string} [props.title] Title/tooltip
 */
const DebugCheckbox = ({ label, param = '', value, setValue, title = '' }) => {
	const k = param || label.toLowerCase();
	return (
		<label title={title}>
			<span>{label}</span>
			<input
				type="checkbox"
				checked={value}
				onChange={(e) =>
					setStateAndQuery({
						key: k,
						value: e.target.checked,
						setState: setValue,
					})
				}
			/>
		</label>
	);
};

/**
 * Number input.
 * 
 * @param {Object} props
 * @param {string} props.label Label text
 * @param {string} [props.param] URL param key (defaults to label lowercased)
 * @param {number} props.value Current value
 * @param {(v: number) => void} props.setValue Setter (also pushes URL)
 * @param {string} [props.title] Title/tooltip
 */
const DebugNumber = ({ label, param = '', value, setValue, title = '' }) => {
	const k = param || label.toLowerCase();
	return (
		<label title={title}>
			<span>{label}</span>
			<input
				type="number"
				value={value}
				onChange={(e) =>
					setStateAndQuery({
						key: k,
						value: parseFloat(e.target.value),
						setState: setValue,
					})
				}
				onKeyDown={(e) => e.stopPropagation()}
			/>
		</label>
	);
};

/**
 * Refresh and optionally reset all debug settings.
 * 
 * @param {Object} props
 * @param {boolean} [props.reset] If true, reset URL to debug=true and reload
 * @param {string} [props.title] Title/tooltip
 * @param {string} [props.label] Button text
 */
const DebugRefresh = ({ reset = false, title = '', label = '' }) => {
	return (
		<button
			title={title}
			onClick={(e) => {
				e.preventDefault();
				if (reset) {
					e.preventDefault();
					const url = new URL(window.location.href);
					url.search = 'debug=true';
					url.hash = '';
					window.location.replace(url.toString());
				} else {
					window.location.reload();
				}
			}}
		>
			{label}
		</button>
	);
};

/**
 * Apply debug settings (usually from query string on page load)
 * 
 * @param {Object} props The properties object
 * @param {Object} props.debug The debug object
 * @param {Object} props.debugIsAllowed Whether or not to debug (clone of settings.debugAllowed)
 * @param {Function} props.setCharacterId The function to set the character id
 * @param {Function} props.setMakeSFX The function to set the make SFX
 * @param {Function} props.setMakeMusic The function to set the make music
 * @param {Function} props.setSettings The function to set the settings
 * @param {Function} props.setJump The function to set the jump
 * @returns {void}
 */
const useDebug = (props) => {
	const { debug, debugIsAllowed, setCharacterId, setMakeSFX, setMakeMusic, setSettings, setJump } = props;
	useEffect(() => {
		if (debugIsAllowed && debug) {
			if (debug?.characterId) {
				setCharacterId(parseInt(debug.characterId));
			}
			if (debug?.makeSFX) {
				setMakeSFX(debug.makeSFX);
			}
			if (debug?.makeMusic) {
				setMakeMusic(debug.makeMusic);
			}
			if (debug?.gameplaySpeed) {
				setSettings((prev) => ({ ...prev, gameplaySpeed: debug.gameplaySpeed}));
			}
			if (debug?.jumpHeight) {
				setJump((prev) => ({ ...prev, height: debug.jumpHeight / 100}));
			}
			if (debug?.jumpHangtime) {
				setJump((prev) => ({ ...prev, hangtime: debug.jumpHangtime}));
			}
			if (debug?.characterHeight) {
				setSettings((prev) => ({ ...prev, characterHeight: debug.characterHeight}));
			}
			if (debug?.userAdjustedMilestone) {
				setSettings((prev) => ({ ...prev, userAdjustedMilestone: (debug.userAdjustedMilestone / 100) / 0.5 }));
			}
			if (debug?.userAdjustedSpeed) {
				setSettings((prev) => ({ ...prev, userAdjustedSpeed: debug.userAdjustedSpeed }));
			}
		}
	}, [debug, setCharacterId, setMakeSFX, setMakeMusic, setSettings, setJump, debugIsAllowed]);
};

/**
 * Debug panel (only when settings.debugAllowed and debug enabled).
 */
export const Debug = () => {
	const { debug, setDebug } = useDebugContext();
	const { settings, setSettings, setJump, jump, makeMusic, setMakeMusic, makeSFX, setMakeSFX } = useSettingsContext();
	const { characterId, setCharacterId } = useCharacterContext();
	const navigate = useNavigate();
	const pagePath = useLocation().pathname;
	const debugRef = useRef(null);
	
	// Setup menu open/close state
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// Apply debug settings from state
	useDebug({
		debugIsAllowed: settings.debugAllowed,
		debug,
		setCharacterId,
		setMakeSFX,
		setMakeMusic,
		setSettings,
		setJump,
	});
	
	// Allow drag-and-drop of SVG level files over the debug panel
	useDebugDropLevel(debugRef);
	
	// Bail if debug is not allowed or enabled
	if (!settings.debugAllowed || !debug) {
		return null;
	}
	
	return (
		<div
			className={`sr-debug${debug?.outlines ? ' sr-debug--outlines' : ''}`}
			ref={debugRef}
		>
			<button onClick={(e) => { e.preventDefault(); setIsMenuOpen(!isMenuOpen); }}>🐞 Debug</button>
			{isMenuOpen && (
			<div className="sr-debug__menu">
					<DebugNumber
						label="🦸 Character"
						param="characterId"
						value={characterId}
						setValue={setCharacterId}
						title="Set the character's jersey number"
					/>
					<DebugNumber
						label="🦒 Height (%)"
						param="characterHeight"
						value={settings.characterHeight}
						setValue={(value) => setSettings({ ...settings, characterHeight: value })}
						title="Set the height of the character"
					/>
					<DebugNumber
						label="🏎️ Speed (%)"
						param="userAdjustedMilestone"
						value={(settings.userAdjustedSpeed)}
						setValue={(value) => setSettings({ ...settings, userAdjustedSpeed: value })}
						title="The user-adjusted speed multiplier (usually use base speed instead)."
					/>
					<DebugNumber
						label="🏃‍➡️ Base (px/s)"
						param="gameplaySpeed"
						value={settings.gameplaySpeed}
						setValue={(value) => setSettings({ ...settings, gameplaySpeed: value })}
						title="Set the base gameplay speed in pixels per second"
					/>
					<DebugNumber
						label="🦘 Height (%)"
						param="jumpHeight"
						value={jump.height * 100}
						setValue={(value) => setJump({ ...jump, height: value / 100})}
						title="Set the jump height in percentage of the screen height"
					/>
					<DebugNumber
						label="🏀 Hangtime"
						param="level (s)"
						value={jump.hangtime}
						setValue={(value) => setJump({ ...jump, hangtime: value })}
						title="Set the jump hangtime in seconds"
					/>
					<DebugNumber
						label="💬 Milestone (%)"
						param="userAdjustedMilestone"
						value={(settings.userAdjustedMilestone * 100) * 0.5}
						setValue={(value) => setSettings({ ...settings, userAdjustedMilestone: (value / 100) / 0.5 })}
						title="Set the milestone duration modifier in percentage (0 to skip)"
					/>
					<DebugCheckbox
						label="🎵 Music"
						param="makeMusic"
						value={makeMusic}
						setValue={(val) => setMakeMusic(val)}
						title="Enable or disable background music"
					/>
					<DebugCheckbox
						label="🔊 SFX"
						param="makeSFX"
						value={makeSFX}
						setValue={(val) => setMakeSFX(val)}
						title="Enable or disable sound effects"
					/>
					<DebugCheckbox
						label="🚷 Autoplay"
						param="autoplay"
						value={debug?.autoplay}
						setValue={(val) => setDebug({ ...debug, autoplay: val })}
						title="Automatically start running when the level loads"
					/>
					<DebugCheckbox
						label="🔀 Router"
						param="router"
						value={debug?.router}
						setValue={(val) => setDebug({ ...debug, router: val })}
						title="Exposes the URL path so you can refresh without going back to the intro page"
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
					<select value={pagePath} onChange={(e) => { e.preventDefault(); navigate(e.target.value); }} title="Navigate to a different page">
						{routes.map(({ path, title }) => (
							<option key={path} value={path}>📄 goto: {title}</option>
						))}
					</select>
					<DebugButton
						label="🫥 Un-collide"
						onClick={() => { document.querySelectorAll('.is-collided').forEach(el => el.classList.remove('is-collided')); }}
						title="Reveal and reset all collided elements"
					/>
					<DebugRefresh
						reset={true}
						title="Reset all debug settings"
						label="🙅 Reset"
					/>
					<DebugRefresh
						reset={false}
						title="Restart the game"
						label="🔄 Refresh"
					/>
				</div>
			)}
		</div>
	);
};