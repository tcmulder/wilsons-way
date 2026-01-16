
import { addInteractivity } from './addInteractivity';
import { addLevelAni } from './ani';

/**
 * Load an SVG level file
 *
 * @param {HTMLElement} elBoard The board DOM element
 * @param {SVGElement} elSVG SVG element
 * @param {Function} setTimelines Function to set timelines in context
 * @param {number} difficultySpeed The difficulty speed setting
 * @return {Promise<SVGElement>} Promise that resolves to the loaded SVG element
 */
export const loadLevel = async (elBoard, elSVG, setTimelines, difficultySpeed) => {
	elBoard.replaceChildren(elSVG);

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

	// Setup level interactivity
	addInteractivity(elBoard);
	
	// Create animation after level is loaded
	addLevelAni(elBoard, setTimelines, difficultySpeed);
	
	// Return the SVG element after all operations are complete
	return elSVG;
};

/**
 * Enable drag-and-drop functionality for loading SVG level files
 *
 * @param {HTMLElement} elBoard The board DOM element
 * @param {Function} setTimelines Function to set timelines in context
 * @param {number} difficultySpeed The difficulty speed setting
 * @return {Function} Cleanup function to remove event listeners
 */
export const allowDrop = (elBoard, debug, setTimelines, difficultySpeed) => {
	if (!elBoard || !debug) return () => {};

	const handleDrop = async (e) => {
		e.preventDefault();
		elBoard.classList.remove('is-dragging');
		const file = e.dataTransfer?.files[0];
		if (file?.type === 'image/svg+xml') {
			const reader = new FileReader();
			reader.onload = async (e2) => {
				const parser = new DOMParser();
				const elSVG = parser.parseFromString(
					e2.target.result,
					'image/svg+xml',
				).documentElement;
				await loadLevel(elBoard, elSVG, setTimelines, difficultySpeed);
			};
			reader.readAsText(file);
		}
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		elBoard.classList.add('is-dragging');
	};

	elBoard.addEventListener('drop', handleDrop);
	elBoard.addEventListener('dragover', handleDragOver);

	// Return cleanup function
	return () => {
		elBoard.removeEventListener('drop', handleDrop);
		elBoard.removeEventListener('dragover', handleDragOver);
	};
};
