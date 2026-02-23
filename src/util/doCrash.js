import gsap from 'gsap';
import { doFreeze } from './doMovement';

/**
 * Check if an obstacle is skippable due to invisible modifier
 *
 * @param {HTMLElement} el The element to check
 * @param {string[]} characterModifiers The current character modifiers
 * @return {boolean} Whether or not the obstacle is skippable
 */
const isSkippableInvisible = (el, characterModifiers) => {
	return characterModifiers.includes('invisible') && el.classList.contains('is-negative') && el.dataset.ignoreModifier !== 'invisible';
};

/**
 * Check if an obstacle should switch polarity on positive objects (make them negative)
 * @param {HTMLElement} el The element to check
 * @param {string[]} characterModifiers The current character modifiers
 * @return {boolean} Whether or not the obstacle should switch polarity on positive objects
 * @returns 
 */
const isPosPolarity = (el, characterModifiers) => {
	return characterModifiers.includes('polarity') && el.classList.contains('is-positive') && el.dataset.ignoreModifier !== 'polarity';
};

/**
 * Apply scoring if an obstacle provides scoring data
 *
 * @param {HTMLElement} el The element to score (if it has scoring data)
 * @param {HTMLElement} elCharacterMessage The character messaging element
 * @param {Function} setScore Function to set the score
 * @param {number} level The current level number
 * @param {string[]} characterModifiers The current character modifiers
 * @param {Function} playSound Function to play a sound ('positive' | 'negative')
 */
export const doScoring = (el, elCharacterMessage, setScore, level, characterModifiers, playSound) => {
	const rawNum = el.dataset.score;
	if (!rawNum || isSkippableInvisible(el, characterModifiers)) return;
	let num = parseInt(rawNum);
	num = isPosPolarity(el, characterModifiers) ? -Math.abs(num) : num;
	const way = num > 0 ? 'positive' : 'negative';
	playSound(way);
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
 * @param {HTMLElement} el The element to check for modifier collisions
 * @param {string[]} characterModifiers The current character modifiers
 * @param {Function} setCharacterModifiers Function to set the character modifiers
 */
export const doModifiers = (el, characterModifiers, setCharacterModifiers) => {
	// Set the most basic flag: collided
	if (!isSkippableInvisible(el, characterModifiers)) {
		el.classList.add('is-collided');
	}
	// Get the modifier value and set it (it's set as a class on the character's element)
	const modifier = el.dataset.modifier;
	if (!modifier) return;
	// Set the modifier
	setCharacterModifiers(prev => [ ...prev, modifier ]);
	// Clear the modifier after 5 seconds
	setTimeout(() => {
		setCharacterModifiers(prev => {
			//  Remove the 1st matching modifier (so if new duplicate modifiers have been set they aren't cleared)
			const index = prev.indexOf(modifier);
			const newArr = index === -1 ? prev : [...prev.slice(0, index), ...prev.slice(index + 1)];
			return newArr;
		});
	}, 5000);
};

/**
 * Handle milestone messaging.
 */
export const doMilestones = (el) => {
	if (!el.classList.contains('sr-milestone-target')) return;
	const elMessage = el.nextElementSibling;
	const delay = parseInt(el.dataset.delay);
	elMessage.style.setProperty('--sr-milestone-delay', `${delay}ms`);
	elMessage.classList.add('is-visible');
	doFreeze();
	setTimeout(() => {
		elMessage.classList.remove('is-visible');
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