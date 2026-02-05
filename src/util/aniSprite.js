import { gsap } from 'gsap';

/**
 * Animate image sprites
 *
 *
 * This function takes an array of elements, and animates them by swapping between
 * their child elements. The elements should have a data attribute of "sprite" set
 * to the interval (in milliseconds) of the animation.
 *
 * @param {HTMLElement} elParent Parent that may contain sprites
 */
export const createAniSprite = ({elParent, status}) => {
	// Create a single master timeline to control all sprite animations
	const masterTimeline = gsap.timeline({ repeat: -1, paused: status.move === 'none' });
	
	elParent?.querySelectorAll('[data-sprite]')?.forEach((el) => {
		if (el.classList.contains('is-animating')) {
			return;
		}
		el.classList.add('is-animating');
		const children = [...el.children];
		const interval = parseInt(el.dataset.sprite) || 100;
		const duration = interval / 1000; // Convert ms to seconds
		
		// Hide all children initially
		gsap.set(children, { visibility: 'hidden' });
		
		// Create a sub-timeline for this sprite that cycles through children infinitely
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
		
		// Add this sprite's timeline to the master timeline at time 0 (runs in parallel)
		masterTimeline.add(spriteTimeline, 0);
		
		// Show the first child immediately when not moving
		if (status.move === 'none' && children.length > 0) {
			gsap.set(children[0], { visibility: 'visible' });
		}
	});
	
	// Return the single master timeline
	return masterTimeline;
};