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
		const interval = el.dataset.sprite;
		let i = 0;
		children.forEach((child) => (child.style.visibility = 'hidden'));
		el.nonStandardTimer = setInterval(() => {
			children[i].style.visibility = 'hidden';
			children[(i = (i + 1) % children.length)].style.visibility = 'visible';
		}, interval);
	});
};