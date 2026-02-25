import { aniLevel } from './aniLevel';
import { convertClassToData } from './convertClassToData';

/**
 * Load an SVG level file
 *
 * @param {Object} props The properties object
 * @param {HTMLElement} props.elBoard The board DOM element
 * @param {SVGElement} props.elSVG SVG element
 * @return {Promise<SVGElement>} Promise that resolves to the loaded SVG element
 */
export const loadLevel = async (props) => {
	const { elBoard, elSVG } = props;
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
	
	// Return the SVG element after all operations are complete
	return elSVG;
};

/**
 * Enable drag-and-drop functionality for loading SVG level files
 *
 * @param {Object} props The properties object
 * @param {HTMLElement} props.elBoard The board DOM element
 * @param {HTMLElement} [props.elDropTarget] The element that should act as the drop target (defaults to elBoard)
 * @param {boolean} props.debug Debug mode
 * @param {Function} props.setTimelines Function to set timelines in context
 * @param {number} props.gameplaySpeed The game speed setting
 * @param {Function} [props.onLevelLoaded] Callback when level is loaded
 * @param {Function} [props.setLevel] React state setter for level
 * @return {Function} Cleanup function to remove event listeners
 */
export const allowDrop = (props) => {
	const {
		elBoard,
		elDropTarget = elBoard,
		debug,
		setTimelines,
		gameplaySpeed,
		onLevelLoaded,
		setLevel,
	} = props;

	if (!elBoard || !elDropTarget || !debug) return () => {};

	const handleDrop = async (e) => {
		e.preventDefault();
		elDropTarget.classList.remove('is-dragging');
		const file = e.dataTransfer?.files[0];
		if (file?.type === 'image/svg+xml') {
			const reader = new FileReader();
			reader.onload = async (e2) => {
				const parser = new DOMParser();
				const elSVG = parser.parseFromString(
					e2.target.result,
					'image/svg+xml',
				).documentElement;
				convertClassToData(elSVG);
				await loadLevel({
					elBoard,
					elSVG,
				});
				// Create animation after level is loaded
				aniLevel({
					elBoard,
					setTimelines,
					gameplaySpeed,
				});
				setLevel(0);
				onLevelLoaded?.();
			};
			reader.readAsText(file);
		}
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		elDropTarget.classList.add('is-dragging');
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		elDropTarget.classList.remove('is-dragging');
	};

	elDropTarget.addEventListener('drop', handleDrop);
	elDropTarget.addEventListener('dragover', handleDragOver);
	elDropTarget.addEventListener('dragleave', handleDragLeave);
	elDropTarget.addEventListener('dragend', handleDragLeave);

	// Return cleanup function
	return () => {
		elDropTarget.removeEventListener('drop', handleDrop);
		elDropTarget.removeEventListener('dragover', handleDragOver);
		elDropTarget.removeEventListener('dragleave', handleDragLeave);
		elDropTarget.removeEventListener('dragend', handleDragLeave);
	};
};
