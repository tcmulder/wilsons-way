import { gsap } from 'gsap';

/**
 * Animate sprite elements by cycling visibility of their children.
 * Each sprite element should have data-sprite set to the frame interval in ms.
 *
 * @param {Object} props
 * @param {HTMLElement} props.elParent Parent element to search for [data-sprite] children.
 * @returns {void} No return value.
 */
export const createAniSprite = (props) => {
	const { elParent } = props;

	elParent?.querySelectorAll('[data-sprite]')?.forEach((el) => {
		// If the element is already animating, skip it.
		if (el.classList.contains('is-animating')) return;

		el.classList.add('is-animating');
		const children = [...el.children];
		const interval = parseInt(el.dataset.sprite) || 100;
		const duration = interval / 1000; // Convert ms to seconds
		
		// Hide all children initially
		gsap.set(children, { visibility: 'hidden' });
		
		// Create a timeline for this sprite that cycles through children infinitely
		const spriteTimeline = gsap.timeline({ repeat: -1 });
		
		children.forEach((child, index) => {
			// Hide previous child (or all if first frame)
			if (index === 0) {
				spriteTimeline.set(children, { visibility: 'hidden' }, 0);
			} else {
				spriteTimeline.set(children[index - 1], { visibility: 'hidden' }, index * duration);
			}
			// Show current child
			spriteTimeline.set(child, { visibility: 'visible' }, index * duration);
		});
		
		// Complete the loop: hide last child and show first child
		const lastIndex = children.length - 1;
		spriteTimeline.set(children[lastIndex], { visibility: 'hidden' }, lastIndex * duration + duration);
		spriteTimeline.set(children[0], { visibility: 'visible' }, lastIndex * duration + duration);
	});
};