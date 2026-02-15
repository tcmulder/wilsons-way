import gsap from 'gsap';

/**
 * Apply scoring if an obstacle provides scoring data
 *
 * @param {HTMLElement} el The element to score (if it has scoring data)
 * @param {HTMLElement} elCharacterMessage The character messaging element
 * @param {Function} setScore Function to set the score
 */
export const checkCollisionScore = (el, elCharacterMessage, setScore) => {
	const score = parseInt(el.dataset.score);
	if (score) {
		setScore(prev => prev + score);
		showCharacterMessage(
			elCharacterMessage,
			`${score > 0 ? '+' : ''}${score}`,
			`is-${score > 0 ? 'positive' : 'negative'}`
		);
		// if (state.sounds.makeSFX && state.sounds.makeSound) {
		// 	toggleSFX(posOrNeg);
		// }
	}
};

/**
 * Show message above the character
 * 
 * @param {HTMLElement} elCharacterMessage The character messaging element
 * @param {string} message The message to show
 */
const showCharacterMessage = (elCharacterMessage, message, className = '') => {
	const span = document.createElement('span');
	span.classList.add(className);
	span.innerHTML = message;
	elCharacterMessage.appendChild(span);
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