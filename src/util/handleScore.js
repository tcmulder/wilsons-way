import gsap from 'gsap';

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
	const num = parseInt(el.dataset.score);
	if (num) {
		const way = num > 0 ? 'positive' : 'negative';
		if (characterModifiers.includes('invisible') && way === 'negative') {
			return;
		}
		playSound(way);
		setScore(prev => [ ...prev, { num, level } ]);
		showCharacterMessage({
			el: elCharacterMessage,
			message: `${'positive' === way ? '+' : ''}${num}`,
			className: `is-${way}`,
		});
	}
};

/**
 * Modify collided obstacles
 *
 * @param {HTMLElement} el The element to check for modifier collisions
 * @param {string[]} characterModifiers The current character modifiers
 * @param {Function} setCharacterModifiers Function to set the character modifiers
 */
export const doModifiers = (el, characterModifiers, setCharacterModifiers) => {
	// Get the modifier value and set it (it's set as a class on the character's element)
	const modifier = el.dataset.modifier;
	if (modifier) {
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
	}
	// Only apply collision if the element should no longer accept future collision effects
	const markAsFinalCollision = !(characterModifiers.includes('invisible') && el.classList.contains('is-negative'));
	if (markAsFinalCollision) {
		el.classList.add('is-collided');
	}
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