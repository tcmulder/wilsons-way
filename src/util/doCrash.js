import gsap from 'gsap';
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
	return characterModifiers.includes('invisible') && el.classList.contains('is-negative') && el.dataset.ignoreModifier !== 'invisible';
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
	return characterModifiers.includes('polarity') && el.classList.contains('is-positive') && el.dataset.ignoreModifier !== 'polarity';
};

/**
 * Apply scoring if an obstacle provides scoring data
 *
 * @param {Object} props The properties object
 * @param {HTMLElement} props.el The element to score (if it has scoring data)
 * @param {HTMLElement} props.elCharacterMessage The character messaging element
 * @param {Function} props.setScore Function to set the score
 * @param {number} props.level The current level number
 * @param {string[]} props.characterModifiers The current character modifiers
 * @param {Function} props.playSound Function to play a sound ('positive' | 'negative')
 */
export const doScoring = (props) => {
	const { el, elCharacterMessage, setScore, level, characterModifiers, playSound } = props;
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
 * @param {HTMLElement} el The milestone target element (must have .sr-milestone-target and data-delay).
 */
export const doMilestones = (el) => {
	if (!el.classList.contains('sr-milestone-target')) return;
	const elMessage = el.nextElementSibling;
	const delay = parseInt(el.dataset.delay);
	elMessage.style.setProperty('--sr-milestone-delay', `${delay}ms`);
	elMessage.classList.add('is-visible');
	doFreeze();
	setTimeout(() => {
		doFreeze(false);
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
	gsap.timeline({ onComplete: () => span.remove() })
	.set(span, {
		opacity: 0,
		y: '1cqmax',
		scale: 0.5
	})
	.to(span, {
		opacity: 1,
		y: '-2cqmax',
		scale: 1.05,
		duration: 1,
		ease: 'power1.out'
	})
	.to(span, {
		opacity: 0,
		duration: 0.45,
		ease: 'power1.in'
	}, 0.55);
};