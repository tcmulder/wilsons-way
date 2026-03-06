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
 */
export const doLives = (props) => {
	const { el, setLives, lives, setGameplayNavigation, debug } = props;
	if (el.classList.contains('is-death')) return;
	const shouldDecrease = el.dataset?.score?.startsWith('-');
	if (shouldDecrease) {
		el.classList.add('is-death');
		const next = lives.cur - 1;
		setLives((prev) => ({ ...prev, cur: Math.max(0, next) }));
		if (next <= 0 && !debug?.immortal) {
			doFreeze();
			setGameplayNavigation('/lost');
		}
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
 * Apply invisibility modifier
 * 
 * @param {Object} props The properties object
 * @param {HTMLElement} props.el The element to apply the collision class to
 * @param {Object} props.elsRef The elements ref object
 */
const modifyInvisible = (props) => {
	const { el, elsRef } = props;
	const els = elsRef?.current;
	const { elObstacles } = els;
	const modifier = el.dataset.modifier;
	// Bail if we're not to modify invisibility
	if (modifier !== 'invisible') return;
	// Set the modifier
	console.log('🤞', 'settings invisible modifier', elObstacles);
	// Clear the modifier after a delay
	const delay = parseInt(el.dataset.modifierDelay) || 5000;
	setTimeout(() => {
		console.log('🤞', 'clearing invisible modifier');
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
	const { el, elsRef } = props;
	const els = elsRef?.current;
	const { elObstacles } = els;
	const modifier = el.dataset.modifier;
	// Bail if we're not to modify invisibility
	if (modifier !== 'polarity') return;
	// Set the modifier
	console.log('🤞', 'settings polarity modifier', elObstacles);
	// Clear the modifier after a delay
	const delay = parseInt(el.dataset.modifierDelay) || 5000;
	setTimeout(() => {
		console.log('🤞', 'clearing polarity modifier');
	}, delay);
};

/**
 * Modify collided obstacles
 *
 * @param {Object} props The properties object
 * @param {HTMLElement} props.el The element to check for modifier collisions
 * @param {Object} props.elsRef The elements ref object
 */
export const doModifiers = (props) => {
	const { el, elsRef } = props;
	// Maybe set our modifications
	modifyCollided({el});
	modifyInvisible({el, elsRef});
	modifyPolarity({el, elsRef});
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
	if (!el.classList.contains('sr-milestone-target')) return;
	const elMessage = el.nextElementSibling;
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