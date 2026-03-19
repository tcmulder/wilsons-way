import { doFreeze } from './doMovement';

/**
 * Apply scoring if an obstacle provides scoring data
 *
 * @param {Object} props The properties object
 * @param {HTMLElement} props.el The element to score (if it has scoring data)
 * @param {Object} props.elsRef The elements ref object
 * @param {HTMLElement} props.elCharacterMessage The character messaging element
 * @param {Function} props.setScore Function to set the score
 * @param {number} props.level The current level number
 * @param {Function} props.playSound Function to play a sound ('positive' | 'negative')
 */
export const doScoring = (props) => {
	const { el, elsRef, setScore, level, playSound } = props;
	const els = elsRef?.current;
	const { elCharacterMessage } = els;
	const rawNum = el.dataset.score;
	if (!rawNum) return;
	const num = parseInt(rawNum);
	if (!num) return; // e.g. if '0' due to modifier being applied
	const way = num > 0 ? 'positive' : 'negative';
	const sound = el.dataset.sound || way;
	playSound(sound);
	setScore(prev => [ ...prev, { num, level } ]);
	showCharacterMessage({
		el: elCharacterMessage,
		message: `${'positive' === way ? '+' : ''}${num}`,
		className: `is-${way}`,
	});
};

/**
 * Increase or decrease lives.
 * 
 * @param {Object} props The properties object
 * @param {HTMLElement} props.el The element to count the life against
 * @param {Object} props.setLives Function to set the lives
 * @param {Object} props.lives The lives object
 * @param {Function} props.setGameplayNavigation Function to set the gameplay navigation
 * @param {Object} props.debug The debug object
 * @param {Boolean} props.debug.immortal Whether the character is immortal
 */
export const doLives = (props) => {
	const { el, setLives, lives, setGameplayNavigation, debug } = props;
	if (el.classList.contains('is-collided-life')) return;
	const lifeData = parseInt(el.dataset.lives);
	if (!lifeData) return;
	el.classList.add('is-collided-life');
	const newLives = Math.min(lives.cur + lifeData, lives.max);
	setLives((prev) => ({ ...prev, cur: newLives }));
	if (newLives <= 0 && !debug?.immortal) {
		doFreeze();
		setGameplayNavigation('/lost');
	}
};

/**
 * Apply collision modifier (to prevent further collisions)
 *
 * @param {Object} props The properties object
 * @param {HTMLElement} props.el The element to apply the collision class to
 */
const modifyCollided = (props) => {
	const { el } = props;
	el.classList.add('is-collided');
};

/**
 * Get original non-modified dataset
 */
const getOriginalDataset = (el) => {
	if (!el || !el.dataset) return {};
	const { dataset } = el;

	// If we already have an original snapshot, just return it
	if (dataset.org) return JSON.parse(dataset.org);

	// Capture all current data-* attributes as the original snapshot
	const original = { ...dataset };
	dataset.org = JSON.stringify(original);
	return original;
};

/**
 * Apply invisibility modifier
 * 
 * @param {Object} props The properties object
 * @param {HTMLElement} props.el The element to apply the collision class to
 * @param {Object} props.elsRef The elements ref object
 */
const modifyInvisible = (props) => {
	const modifier = props.el.dataset.modifier;
	// Bail if we're not to modify invisibility
	if (modifier !== 'invisible') return;
	
	// Get all obstacles
	const { el, elsRef } = props;
	const els = elsRef?.current;
	const { elObstacles } = els;

	// Find all negative-scoring obstacles that do not ignore the invisible modifier
	const elTargets = elObstacles.filter((obstacle) => {
		const score = obstacle.dataset.score;
		if (!score) return false;
		const isNegative = score.startsWith('-');
		const ignoresInvisible = obstacle.dataset?.ignoreModifier?.split(',').includes('invisible');
		return isNegative && !ignoresInvisible;
	});

	// Apply the invisible modifier: add class and zero out score.
	elTargets.forEach((elObstacle) => {
		// Ensure we have an original snapshot before mutating
		getOriginalDataset(elObstacle);
		elObstacle.dataset.score = '0';
		elObstacle.setAttribute('data-ignore-hide', '');
		elObstacle.classList.add('sr-modifier--invisible');
	});

	// Clear the modifier after a delay
	const delay = parseInt(el.dataset.modifierDelay) || 5000;
	setTimeout(() => {
		elTargets.forEach((elObstacle) => {
			const originalDataset = getOriginalDataset(elObstacle);
			elObstacle.dataset.score = originalDataset.score;
			if (!originalDataset.ignoreHide) {
				elObstacle.removeAttribute('data-ignore-hide');
				elObstacle.classList.remove('is-collided');
			}
			elObstacle.classList.remove('sr-modifier--invisible');
		});
	}, delay);
};

/**
 * Apply polarity modifier
 * 
 * @param {Object} props The properties object
 * @param {HTMLElement} props.el The element to apply the collision class to
 * @param {Object} props.elsRef The elements ref object
 */
const modifyPolarity = (props) => {
	const modifier = props.el.dataset.modifier;
	// Bail if we're not to modify polarity
	if (modifier !== 'polarity') return;

	// Get all obstacles
	const { el, elsRef } = props;
	const els = elsRef?.current;
	const { elObstacles } = els;

	// Find all positive-scoring obstacles that do not ignore the polarity modifier
	const elTargets = elObstacles.filter((obstacle) => {
		const score = obstacle.dataset.score;
		if (!score) return false;
		const num = parseInt(score, 10);
		const isPositive = Number.isFinite(num) && num > 0;
		const ignoresPolarity = obstacle.dataset?.ignoreModifier?.split(',').includes('polarity');
		return isPositive && !ignoresPolarity;
	});

	// Temporarily flip their score to negative, remembering the original value
	elTargets.forEach((elObstacle) => {
		// Ensure we have an original snapshot before mutating
		getOriginalDataset(elObstacle);
		const score = elObstacle.dataset.score;
		const num = parseInt(score, 10);
		if (!Number.isFinite(num)) return;
		elObstacle.dataset.score = String(-Math.abs(num));
		elObstacle.classList.add('sr-modifier--polarity');
	});

	// Clear the modifier after a delay
	const delay = parseInt(el.dataset.modifierDelay) || 5000;
	setTimeout(() => {
		elTargets.forEach((elObstacle) => {
			const originalDataset = getOriginalDataset(elObstacle);
			elObstacle.dataset.score = originalDataset.score;
			elObstacle.classList.remove('sr-modifier--polarity');
		});
	}, delay);
};

/**
 * Apply cripple modifier
 * 
 * Set life value in the yellow (or, if in the yellow,
 * into the red; or, if in the red, decrements by 1).
 * 
 * @param {Object} props The properties object
 * @param {HTMLElement} props.el The element to apply the collision class to
 * @param {Object} props.elsRef The elements ref object
 * @param {Object} props.lives The lives object
 * @param {Function} props.setLives Function to set the lives
 */
const modifyCripple = (props) => {
	const { el, lives } = props;
	const modifier = el.dataset.modifier;
	if (modifier !== 'cripple') return;

	const max = parseInt(lives?.max, 10);
	const cur = parseInt(lives?.cur, 10);
	if (!Number.isFinite(max) || !Number.isFinite(cur) || max <= 0) return;

	// "Yellow" is <= 50% max; "red" is <= ~33% max (see Interface battery thresholds).
	const halfDead = cur <= max * 0.5;
	const almostDead = cur <= max * 0.33;

	let targetCur;
	if (almostDead) {
		// If already in red, knock off 1 life.
		targetCur = Math.max(0, cur - 1);
	} else if (halfDead) {
		// If in yellow, set into red.
		targetCur = Math.floor(max * 0.33);
	} else {
		// Otherwise, set into yellow.
		targetCur = Math.floor(max * 0.5);
	}

	// Let `doLives` apply the delta so it can still handle game-over navigation.
	const delta = targetCur - cur;
	el.dataset.lives = String(delta);
};

/**
 * Modify collided obstacles
 *
 * @param {Object} props The properties object
 * @param {HTMLElement} props.el The element to check for modifier collisions
 * @param {Object} props.elsRef The elements ref object
 */
export const doModifiers = (props) => {
	const { el, elsRef, lives, setLives } = props;
	// Maybe set our modifications
	modifyInvisible({el, elsRef});
	modifyPolarity({el, elsRef});
	modifyCripple({el, elsRef, lives, setLives});
	modifyCollided({el});
};

/**
 * When a milestone obstacle is hit, show its message, freeze gameplay for the delay, then resume.
 * 
 * If delay is 0 we don't show the message (allows for disabling messages)
 *
 * @param {Object} props The properties object
 * @param {HTMLElement} props.el The milestone target element (must have .sr-milestone-target and data-delay).
 * @param {number} [props.userAdjustedMilestone=1] Multiplier for milestone delay
 */
export const doMilestones = (props) => {
	const { el, userAdjustedMilestone = 1 } = props;
	if (!el.dataset.milestone) return;
	const elMessage = document.getElementById(el.dataset.milestone);
	const baseDelay = parseInt(el.dataset.delay);
	const multiplier = Number.isFinite(userAdjustedMilestone) ? userAdjustedMilestone : 1;
	const delay = Math.max(0, Math.round(baseDelay * multiplier));
	if (!delay) return;
	elMessage.style.setProperty('--sr-milestone-delay', `${delay}ms`);
	elMessage.classList.add('is-visible');
	elMessage.classList.add('is-frozen');
	doFreeze();
	setTimeout(() => {
		doFreeze(false);
		elMessage.classList.remove('is-frozen');
	}, delay);
};

/**
 * Show message above the character
 * 
 * @param {Object} props The props object
 * @param {HTMLElement} props.el Element to append the message to
 * @param {string} props.message The message to show
 * @param {string} props.className The class name to add to the span
 */
const showCharacterMessage = (props) => {
	const { el, message, className = '' } = props;
	const span = document.createElement('span');
	span.classList.add(className);
	span.innerHTML = message;
	el.appendChild(span);
	span.addEventListener('animationend', () => span.remove(), { once: true });
};