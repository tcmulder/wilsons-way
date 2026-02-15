import gsap from 'gsap';

/**
 * Apply scoring if an obstacle provides scoring data
 *
 * @param {HTMLElement} el The element to score (if it has scoring data)
 * @param {HTMLElement} elCharacterMessage The character messaging element
 * @param {Function} setScore Function to set the score
 * @param {Function} playSound Function to play a sound ('positive' | 'negative')
 */
export const checkCollisionScore = (el, elCharacterMessage, setScore, playSound) => {
	const score = parseInt(el.dataset.score);
	if (score) {
		const way = score > 0 ? 'positive' : 'negative';
		playSound(way);
		setScore(prev => prev + score);
		showCharacterMessage({
			el: elCharacterMessage,
			message: `${'positive' === way ? '+' : ''}${score}`,
			className: `is-${way}`,
		});
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