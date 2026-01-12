import { state, setScoreState } from './state';
import { setup } from './init';
import { getParam } from './utilities';
import { setMessage } from './messages';
import { loadSvgLevel } from './level';

/**
 * Allow drop of custom SVG levels
 */
const allowDrop = () => {
	state.elStage.addEventListener('drop', (e) => {
		e.preventDefault();
		const file = e.dataTransfer?.files[0];
		if (file?.type === 'image/svg+xml') {
			const reader = new FileReader();
			reader.onload = async (e2) => {
				const parser = new DOMParser();
				const elSVG = parser.parseFromString(
					e2.target.result,
					'image/svg+xml',
				).documentElement;
				await loadSvgLevel(elSVG);
				setup();
			};
			reader.readAsText(file);
		}
	});

	state.elStage.addEventListener('dragover', (e) => {
		e.preventDefault();
	});
};

/**
 * Force a message to display above all the others
 *
 * @param {string} name Message name (data-message value)
 */
const setMessageDebug = (name) => {
	// Run this after everything else to force it to the top
	setTimeout(() => {
		state.elStage.querySelectorAll('[data-message]').forEach((el) => {
			el.style.zIndex = 0;
		});
		state.elStage.querySelector(`[data-message="${name}"]`).style.zIndex = 999;
		if (name === 'winner') {
			setScoreState(1000000, false);
		}
		setMessage(name);
	}, 100);
};

/**
 * Maybe enable some debugging
 */
const enableDebugOptions = () => {
	if (getParam('message') === '0') {
		state.enableMessages = false;
	} else if (getParam('message')) {
		setMessageDebug(getParam('message'));
	}
	if (getParam('drag') === '1') {
		allowDrop();
	}
	if (getParam('autoplay') === '0') {
		state.enableAutoplay = false;
	}
	if (getParam('level')) {
		state.level.current = parseInt(getParam('level'));
	}
	if (getParam('character')) {
		state.character = parseInt(getParam('character'));
	}
	if (getParam('speed')) {
		state.speed.percentage = parseFloat(getParam('speed'));
	}
	if (getParam('jump')) {
		state.jumpHeight = parseFloat(getParam('jump'));
	}
	if (getParam('hangtime')) {
		state.hangtime = parseFloat(getParam('hangtime'));
	}
	if (getParam('crash')) {
		state.difficultyCrash = parseFloat(getParam('crash')) / 100;
		state.elCharacter.querySelector('.sr-character-crash').style.outline =
			'3px dashed red';
		state.elCharacter.querySelector('.sr-character-crash').style.outlineOffset =
			'-1px';
	}
	if (getParam('milestone')) {
		state.delayMilestone = parseFloat(getParam('milestone'));
	}
	if (getParam('countdown')) {
		state.delayCountdown = parseFloat(getParam('countdown'));
	}
	if (getParam('score')) {
		state.score = parseFloat(getParam('score'));
	}
};

/**
 * Show debug options
 */
const showDebugOptions = () => {
	/**
	 * Create a wrapper
	 */
	const wrap = document.createElement('div');
	wrap.className = 'sr-debug-form-wrap';

	/**
	 * Add an activation toggle
	 */
	const toggle = document.createElement('input');
	toggle.type = 'checkbox';
	toggle.name = 'toggle';
	toggle.setAttribute('aria-label', 'Show/Hide Debug Options');
	const toggleLabel = document.createElement('label');
	toggleLabel.textContent = 'Debug';
	toggleLabel.prepend(toggle);
	wrap.appendChild(toggleLabel);

	/**
	 * Create the form itself
	 */
	const form = document.createElement('form');
	form.className = 'sr-debug-form';
	wrap.prepend(form);

	/**
	 * Add message test select box
	 */
	const messageSelect = document.createElement('select');
	messageSelect.name = 'test-message';
	const messageTypes = ['default'];
	messageTypes.push(
		...[...state.elStage.querySelectorAll('[data-message]')].map((el) =>
			el.getAttribute('data-message'),
		),
	);
	messageTypes.forEach((type) => {
		const option = document.createElement('option');
		option.value = type === 'default' ? '' : type;
		option.textContent = type === 'default' ? '💬 Display Message ▼' : type;
		option.selected = type === 'default';
		messageSelect.appendChild(option);
	});
	messageSelect.addEventListener('change', (e) => {
		if (e.target.value) {
			setMessageDebug(e.target.value);
		}
	});
	form.appendChild(messageSelect);

	/**
	 * Add checkbox options
	 */
	const checkboxOptions = [
		{ name: 'drag', value: '1', label: '🐉 SVG level drag & drop' },
		{ name: 'autoplay', value: '0', label: '🏎️ Disable autoplay' },
		{ name: 'message', value: '0', label: '🔕 Disable messages' },
	];
	const numberOptions = [
		{ name: 'level', label: '🎚️ Level (1-4)', min: 1, max: 4 },
		{ name: 'character', label: '🐶 Character (1-4)', min: 1, max: 4 },
		{ name: 'speed', label: '🏃 Speed (1-199%)', min: 1, max: 199 },
		{ name: 'jump', label: '🦘 Jump Up (1-50)', min: 1, max: 50 },
		{ name: 'hangtime', label: '🏀 Hangtime MS', min: 100, max: 9999 },
		{ name: 'crash', label: '🧱 Crash area (1-200%)', min: 1, max: 200 },
		{ name: 'milestone', label: '⏱️ Milestone MS Delay', min: 100, max: 9999 },
		{ name: 'countdown', label: '🔫 Countdown MS Delay', min: 1, max: 999 },
		{ name: 'score', label: '🏆 Starting Score', min: 1, max: 99999 },
	];
	checkboxOptions.forEach((option) => {
		const label = document.createElement('label');
		const checkbox = document.createElement('input');
		checkbox.type = 'checkbox';
		checkbox.name = option.name;
		checkbox.value = option.value;
		checkbox.checked = getParam(option.name) === option.value;
		label.appendChild(checkbox);
		label.appendChild(document.createTextNode(option.label));
		form.appendChild(label);
	});

	/**
	 * Add number options
	 */
	numberOptions.forEach((option) => {
		const label = document.createElement('label');
		const input = document.createElement('input');
		input.type = 'number';
		input.name = option.name;
		input.min = option.min;
		input.max = option.max;
		const currentValue = getParam(option.name);
		if (currentValue) {
			input.value = currentValue;
		}
		label.appendChild(document.createTextNode(option.label));
		label.appendChild(input);
		form.appendChild(label);
	});

	/**
	 * Bind submit behavior
	 */
	form.addEventListener('submit', (e) => {
		e.preventDefault();
		const params = new URLSearchParams(window.location.search);
		params.set('debug', '1'); // Always include debug=1

		// Get all checked checkboxes
		const formData = new FormData(form);
		checkboxOptions.forEach((option) => {
			if (formData.has(option.name)) {
				params.set(option.name, option.value);
			} else if (params.has(option.name)) {
				params.delete(option.name);
			}
		});

		// Get all number inputs with values
		numberOptions.forEach((option) => {
			const value = formData.get(option.name);
			if (value) {
				params.set(option.name, value);
			} else if (params.has(option.name)) {
				params.delete(option.name);
			}
		});

		// Get select box values
		if (messageSelect.value) {
			params.set('message', messageSelect.value);
		}

		// Reload with new params
		window.location.search = params.toString();
	});

	/**
	 * Add submit button
	 */
	const submit = document.createElement('button');
	submit.type = 'submit';
	submit.textContent = 'Apply These Options →';
	form.appendChild(submit);

	// Add the form to the DOM
	document.body.prepend(wrap);
};

/**
 * Enable debug mode if ?debug=1
 */
export const maybeEnableDebugMode = () => {
	if (state.wp.settings.debug && getParam('debug') === '1') {
		state.enableDebug = true;
		showDebugOptions();
		enableDebugOptions();
	}
};
