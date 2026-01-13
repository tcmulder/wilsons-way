import { convertClassToData } from './convertClassToData';

/**
 * Load an SVG level file
 *
 * @param {string} elSVG SVG element
 * @return {Promise<SVGElement>} Promise that resolves to the loaded SVG element
 */
export const loadSvgLevel = async (elBoard, elSVG) => {
	elBoard.replaceChildren(elSVG);
	convertClassToData(elSVG);

	// Move any parallax layers to their own SVG graphics for better animation performance
	const elParallaxes = Array.from(
		elSVG.querySelectorAll('[data-parallax]'),
	).reverse();
	elParallaxes.forEach((elParallax) => {
		// Create a new SVG element with the same viewBox
		const newSVG = document.createElementNS(
			'http://www.w3.org/2000/svg',
			'svg',
		);
		newSVG.setAttribute('viewBox', elSVG.getAttribute('viewBox'));
		newSVG.setAttribute('class', 'sr-parallax-layer');
		newSVG.dataset.parallax = elParallax.dataset.parallax;
		// Clone the parallax element and append to the new SVG
		const clonedElement = elParallax.cloneNode(true);
		newSVG.appendChild(clonedElement);
		// Add the new SVG to the board
		if (newSVG.dataset.parallax) {
			elBoard.prepend(newSVG);
		} else {
			elBoard.appendChild(newSVG);
		}
		// Remove the original parallax element from the main SVG
		elParallax.remove();
	});
	// Return the SVG element after all operations are complete
	return elSVG;
};