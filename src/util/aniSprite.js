import { gsap } from 'gsap';

/**
 * Animate image sprites
 *
 *
 * This function takes an array of elements, and animates them by swapping between
 * their child elements. The elements should have a data attribute of "sprite" set
 * to the interval (in milliseconds) of the animation.
 *
 * @param {HTMLElement[]} els The elements to animate
 */
export const createAniSprite = async (els) => {
	els?.forEach((el) => {
		if (el.classList.contains('is-animating')) {
			return;
		}
		el.classList.add('is-animating');
		const children = [...el.children];
		const interval = parseInt(el.dataset.sprite) || 100;
		const duration = interval / 1000; // Convert ms to seconds
		
		// Hide all children initially
		gsap.set(children, { visibility: 'hidden' });
		
		// Create a timeline that cycles through children infinitely
		const timeline = gsap.timeline({ repeat: -1 });
		
		children.forEach((child, index) => {
			// Hide previous child (or all if first frame)
			if (index === 0) {
				timeline.set(children, { visibility: 'hidden' }, 0);
			} else {
				timeline.set(children[index - 1], { visibility: 'hidden' }, index * duration);
			}
			// Show current child
			timeline.set(child, { visibility: 'visible' }, index * duration);
		});
		
		// Complete the loop: hide last child and show first child
		const lastIndex = children.length - 1;
		timeline.set(children[lastIndex], { visibility: 'hidden' }, lastIndex * duration + duration);
		timeline.set(children[0], { visibility: 'visible' }, lastIndex * duration + duration);
		
		// Store timeline on element for potential cleanup
		el.gsapTimeline = timeline;
	});
};