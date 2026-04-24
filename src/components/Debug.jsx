import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
	useAudioContext,
	useDebugContext,
	useSettingsContext,
	useCharacterContext,
	useScoreContext,
} from '../context/useContexts';
import { useDebugDropLevel } from '../hooks/useDebugDropLevel';
import { routes } from '../routes';

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
 * Ignore arrow keys.
 * 
 * @param {KeyboardEvent} e The keyboard event
 */
const ignoreKeyboardInput = (e) => {
	const arrows = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
	if (arrows.includes(e.key)) {
		e.preventDefault();
	}
};

/**
 * Shared debug-field label wrapper.
 *
 * @param {Object} props
 * @param {string} [props.icon] Icon shown on reset button
 * @param {string} props.label Label text
 * @param {string} [props.title] Title/tooltip
 * @param {string} [props.resetKey] Query key to update on reset
 * @param {any} [props.resetValue] Initial value to reset to (captured once)
 * @param {(v: any) => void} [props.onReset] State setter for reset
 * @param {React.ReactNode} [props.children] Field controls rendered beside label
 */
const DebugLabel = ({
	icon = '',
	label,
	title = '',
	resetKey = '',
	resetValue = undefined,
	onReset = null,
	children,
}) => {
	const [defaultValue] = useState(resetValue);
	return (
		<div className="sr-debug__label">
			<button
				type="reset"
				title="Double-click to reset to default value"
				onDoubleClick={(e) => {
					if (!resetKey || !onReset || defaultValue === undefined) return;
					e.preventDefault();
					setStateAndQuery({
						key: resetKey,
						value: defaultValue,
						setState: onReset,
					});
				}}
			>
				{icon}
			</button>
			<label title={title}>
				<span>{label}</span>
				{children}
			</label>
		</div>
	);
};

/**
 * Debug button.
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
 * @param {string} [props.icon] Label icon
 * @param {string} props.label Label text
 * @param {string} [props.param] URL param key (defaults to label lowercased)
 * @param {boolean} props.value Checked state
 * @param {(v: boolean) => void} props.setValue Setter (also pushes URL)
 * @param {string} [props.title] Title/tooltip
 */
const DebugCheckbox = ({ icon = '', label, param = '', value, setValue, title = '' }) => {
	const k = param || label.toLowerCase();
	return (
		<DebugLabel
			icon={icon}
			label={label}
			title={title}
			resetKey={k}
			resetValue={value}
			onReset={setValue}
		>
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
		</DebugLabel>
	);
};

/**
 * Number input.
 * 
 * @param {Object} props
 * @param {string} [props.icon] Label icon
 * @param {string} props.label Label text
 * @param {string} [props.param] URL param key (defaults to label lowercased)
 * @param {number} props.value Current value
 * @param {(v: number) => void} props.setValue Setter (also pushes URL)
 * @param {string} [props.title] Title/tooltip
 * @param {number} [props.step] Step size
 */
const DebugNumber = ({ icon = '', label, param = '', value, setValue, title = '', step = 1 }) => {
	const k = param || label.toLowerCase();
	return (
		<DebugLabel
			icon={icon}
			label={label}
			title={title}
			resetKey={k}
			resetValue={value}
			onReset={setValue}
		>
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
				onKeyDown={ignoreKeyboardInput}
				step={step}
			/>
		</DebugLabel>
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

const DebugRange = ({ icon = '', label, param = '', value, setValue, title = '', step = 1 }) => {
	const k = param || label.toLowerCase();
	return (
		<DebugLabel
			icon={icon}
			label={label}
			title={title}
			resetKey={k}
			resetValue={value}
			onReset={setValue}
		>
			<input
				type="range"
				min="-400"
				max="500"
				value={value}
				onChange={(e) => setStateAndQuery({
					key: k,
					value: parseFloat(e.target.value),
					setState: setValue,
				})}
				step={step}
				onKeyDown={ignoreKeyboardInput}
			/>
			<input
				type="number"
				value={Math.round(value)}
				onChange={(e) =>
					setStateAndQuery({
						key: k,
						value: parseInt(e.target.value),
						setState: setValue,
					})
				}
				onKeyDown={ignoreKeyboardInput}
				step={step}
			/>
		</DebugLabel>
	);
};

/**
 * Load debug settings from query string on page load.
 * 
 * @param {boolean} should If true, set the state.
 * @param {Function} set Function to set the state.
 */
const loadState = (should, set) => {
	// Allow nullish values (0, false) to pass through
	if (should !== null && should !== undefined) set();
};

/**
 * Debug panel (only when settings.debugAllowed and debug enabled).
 */
export const Debug = () => {
	const { debug, setDebug } = useDebugContext();
	const { settings, setSettings, setJump, jump } = useSettingsContext();
	const { makeMusic, setMakeMusic, makeSFX, setMakeSFX } = useAudioContext();
	const { debugAllowed } = settings;
	const { characterId, setCharacterId } = useCharacterContext();
	const { score, setScore, lives, setLives } = useScoreContext();
	const navigate = useNavigate();
	const pagePath = useLocation().pathname;
	const debugRef = useRef(null);
	
	// Setup menu open/close state
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// Apply debug settings from query string on page load
	useEffect(() => {
		if (debugAllowed && debug) {
			loadState(debug?.characterId, () => setCharacterId(parseInt(debug.characterId)));
			loadState(debug?.characterHeight, () => setSettings((prev) => ({ ...prev, characterHeight: debug.characterHeight})));
			loadState(debug?.gameplaySpeed, () => setSettings((prev) => ({ ...prev, gameplaySpeed: debug.gameplaySpeed})));
			loadState(debug?.jumpHeight, () => setJump((prev) => ({ ...prev, height: debug.jumpHeight / 100})));
			loadState(debug?.jumpHangtime, () => setJump((prev) => ({ ...prev, hangtime: debug.jumpHangtime})));
			loadState(debug?.userAdjustedCrash, () => setSettings((prev) => ({ ...prev, userAdjustedCrash: debug.userAdjustedCrash / 100})));
			loadState(debug?.userAdjustedMilestone, () => setSettings((prev) => ({ ...prev, userAdjustedMilestone: (debug.userAdjustedMilestone / 100) / 0.5 })));
			loadState(debug?.lives, () => setLives((prev) => ({ ...prev, max: debug.lives })));
			loadState(debug?.makeMusic, () => setMakeMusic(debug.makeMusic));
			loadState(debug?.makeSFX, () => setMakeSFX(debug.makeSFX));
		}
	}, [debug, setCharacterId, setMakeSFX, setMakeMusic, setSettings, setJump, debugAllowed, setLives]);
	
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
			<button className="sr-debug__toggle" onClick={(e) => { e.preventDefault(); setIsMenuOpen(!isMenuOpen); }}>🐞 Debug</button>
			{isMenuOpen && (
			<div className="sr-debug__menu">
					<DebugRange
						icon="🏎️"
						label="Speed"
						param="userAdjustedSpeed"
						value={settings.userAdjustedSpeed * 100}
						setValue={(value) => setSettings({ ...settings, userAdjustedSpeed: value / 100 })}
						title="The user-adjusted speed multiplier (usually use base speed instead, resets on refresh)."
						step={25}
					/>
					<DebugNumber
						icon="🏃‍➡️"
						label="Base (px/s)"
						param="gameplaySpeed"
						value={settings.gameplaySpeed}
						setValue={(value) => setSettings({ ...settings, gameplaySpeed: value })}
						title="Set the base gameplay speed in pixels per second"
					/>
					<DebugNumber
						icon="🦘"
						label="Height (%)"
						param="jumpHeight"
						value={jump.height * 100}
						setValue={(value) => setJump({ ...jump, height: value / 100})}
						title="Set the jump height in percentage of the screen height"
					/>
					<DebugNumber
						icon="🏀"
						label="Hangtime"
						param="jumpHangtime"
						value={jump.hangtime}
						setValue={(value) => setJump({ ...jump, hangtime: value })}
						title="Set the jump hangtime in seconds"
						step={0.1}
					/>
					<DebugNumber
						icon="💥"
						label="Crash (%)"
						param="userAdjustedCrash"
						value={settings.userAdjustedCrash * 100}
						setValue={(value) => setSettings({ ...settings, userAdjustedCrash: value / 100 })}
						title="Set the crash difficulty in percentage"
					/>
					<DebugNumber
						icon="💯"
						label="Score +/-"
						param="score"
						value={(score ?? []).find(s => s.level === -1 || s.level === 0)?.num ?? 0}
						setValue={(value) => setScore(prev => {
							const list = prev ?? [];
							const rest = list.filter(s => s.level !== -1 && s.level !== 0);
							return [...rest, { level: -1, num: value }];
						})}
						title="Add to or remove from the total score"
					/>
					<DebugNumber
						icon="🦸"
						label="Character"
						param="characterId"
						value={characterId}
						setValue={setCharacterId}
						title="Set the character's jersey number"
					/>
					<DebugNumber
						icon="🦒"
						label="Height (%)"
						param="characterHeight"
						value={settings.characterHeight}
						setValue={(value) => setSettings({ ...settings, characterHeight: value })}
						title="Set the height of the character"
					/>
					<DebugNumber
						icon="💬"
						label="Milestone (%)"
						param="userAdjustedMilestone"
						value={(settings.userAdjustedMilestone * 100) * 0.5}
						setValue={(value) => setSettings({ ...settings, userAdjustedMilestone: (value / 100) / 0.5 })}
						title="Set the milestone duration modifier in percentage (0 to skip)"
					/>
					<DebugNumber
						icon="💀"
						label="Lives (#)"
						param="lives"
						value={lives?.max || 10}
						setValue={(value) => setLives((prev) => ({ ...prev, max: value }))}
						title="Set the number of lives"
					/>
					<DebugCheckbox
						icon="☠️"
						label="Immortal"
						param="immortal"
						value={debug.immortal}
						setValue={(value) => setDebug({ ...debug, immortal: value })}
						title="Don't die on life loss"
					/>
					<DebugCheckbox
						icon="🎵"
						label="Music"
						param="makeMusic"
						value={makeMusic}
						setValue={(val) => setMakeMusic(val)}
						title="Enable or disable background music"
					/>
					<DebugCheckbox
						icon="🔊"
						label="SFX"
						param="makeSFX"
						value={makeSFX}
						setValue={(val) => setMakeSFX(val)}
						title="Enable or disable sound effects"
					/>
					<DebugCheckbox
						icon="🚷"
						label="Autoplay"
						param="autoplay"
						value={debug?.autoplay}
						setValue={(val) => setDebug({ ...debug, autoplay: val })}
						title="Automatically start running when the level loads"
					/>
					<DebugCheckbox
						icon="🎬"
						label="Slideshow"
						param="slideshow"
						value={debug?.slideshow ?? true}
						setValue={(val) => setDebug({ ...debug, slideshow: val })}
						title="Use timed page transitions when enabled"
					/>
					<DebugCheckbox
						icon="👁️"
						label="Outlines"
						param="outlines"
						value={debug?.outlines}
						setValue={(val) => setDebug({ ...debug, outlines: val })}
						title={[
							// unused: 🟧⬜🟪🟫⬛
							'🟦 level boundary',
							'🟨 crash area',
							'🟩 positive',
							'🟥 negative',
						].join('\n')}
					/>
					<DebugCheckbox
						icon="🔀"
						label="Router"
						param="router"
						value={debug?.router}
						setValue={(val) => setDebug({ ...debug, router: val })}
						title="Exposes the URL path so you can refresh without going back to the intro page"
					/>
					<DebugLabel icon="📄" label="goto">
						<select
							value={pagePath}
							onChange={(e) => { e.preventDefault(); navigate(e.target.value); }}
							onKeyDown={ignoreKeyboardInput}
							title="Navigate to a different page"
						>
							{routes.map(({ path, debug }) => {
								if (path === '/level/0') return null;
								return <option key={path} value={path}>{debug}</option>;
							})}
						</select>
					</DebugLabel>
					<DebugButton
						label="🫥 Un-collide"
						onClick={() => {
							document.querySelectorAll('.is-collided').forEach(el => el.classList.remove('is-collided', 'is-collided-life'));
							document.querySelectorAll('.sr-milestone-message.is-visible').forEach(el => el.classList.remove('is-visible'));	
						}}
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