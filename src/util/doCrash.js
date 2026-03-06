import { gsap } from 'gsap';
import { doFreeze } from './doMovement';

/**
 * Check if an obstacle is skippable due to invisible modifier
 *
 * @param {Object} props The properties object
 * @param {HTMLElement} props.el The element to check
 * @param {string[]} props.characterModifiers The current character modifiers
 * @return {boolean} Whether or not the obstacle is skippable
 */
const isSkippableInvisible = (props) => {
	const { el, characterModifiers } = props;
	const isMod = characterModifiers.includes('invisible');
	const isPos = !el.dataset?.score?.startsWith('-');
	const noIgnore = el.dataset.ignoreModifier !== 'invisible';
	return isMod && !isPos && noIgnore;
};

/**
 * Check if an obstacle should switch polarity on positive objects (make them negative)
 *
 * @param {Object} props The properties object
 * @param {HTMLElement} props.el The element to check
 * @param {string[]} props.characterModifiers The current character modifiers
 * @return {boolean} Whether or not the obstacle should switch polarity on positive objects
 */
const isPosPolarity = (props) => {
	const { el, characterModifiers } = props;
	const isMod = characterModifiers.includes('polarity');
	const isPos = !el.dataset?.score?.startsWith('-');
	const noIgnore = el.dataset.ignoreModifier !== 'polarity';
	return isMod && isPos && noIgnore;
};

/**
 * Apply scoring if an obstacle provides scoring data
 *
 * @param {Object} props The properties object
 * @param {HTMLElement} props.el The element to score (if it has scoring data)
 * @param {Object} props.elsRef The elements ref object
 * @param {HTMLElement} props.elCharacterMessage The character messaging element
 * @param {Function} props.setScore Function to set the score
 * @param {number} props.level The current level number
 * @param {string[]} props.characterModifiers The current character modifiers
 * @param {Function} props.playSound Function to play a sound ('positive' | 'negative')
 */
export const doScoring = (props) => {
	const { el, elsRef, setScore, level, characterModifiers, playSound } = props;
	const els = elsRef?.current;
	const { elCharacterMessage } = els;
	const rawNum = el.dataset.score;
	if (!rawNum || isSkippableInvisible({ el, characterModifiers })) return;
	let num = parseInt(rawNum);
	num = isPosPolarity({ el, characterModifiers }) ? -Math.abs(num) : num;
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
	const shouldDecrease = el.dataset?.score?.startsWith('-');
	if (shouldDecrease) {
		const next = lives.cur - 1;
		setLives((prev) => ({ ...prev, cur: Math.max(0, next) }));
		if (next <= 0 && !debug?.immortal) {
			doFreeze();
			setGameplayNavigation('/lost');
		}
	}
};

/**
 * Modify collided obstacles
 *
 * @param {Object} props The properties object
 * @param {HTMLElement} props.el The element to check for modifier collisions
 * @param {string[]} props.characterModifiers The current character modifiers
 * @param {Function} props.setCharacterModifiers Function to set the character modifiers
 */
export const doModifiers = (props) => {
	const { el, characterModifiers, setCharacterModifiers } = props;
	// Set the most basic flag: collided
	if (!isSkippableInvisible({ el, characterModifiers })) {
		el.classList.add('is-collided');
	}
	// Get the modifier value if any
	const modifier = el.dataset.modifier;
	if (!modifier) return;
	// Set the modifier
	setCharacterModifiers(prev => [ ...prev, modifier ]);
	// Clear the modifier after a delay
	const delay = parseInt(el.dataset.modifierDelay) || 5000;
	setTimeout(() => {
		setCharacterModifiers(prev => {
			//  Remove the 1st matching modifier (so if new duplicate modifiers have been set they aren't cleared)
			const index = prev.indexOf(modifier);
			const newArr = index === -1 ? prev : [...prev.slice(0, index), ...prev.slice(index + 1)];
			return newArr;
		});
	}, delay);
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