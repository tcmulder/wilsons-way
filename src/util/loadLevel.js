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
 * Collect elevated shelf elements (jump-on/jump-off surfaces plus ground) from the board.
 *
 * @param {HTMLElement} elBoard The board DOM element (e.g. .sr-board)
 * @returns {Element[]} Array of direct children of .sr-shelves
 */
export function getShelves(elBoard) {
	const elShelves = elBoard?.querySelectorAll('.sr-shelves > *') ?? [];
	return Array.from(elShelves);
}

/**
 * Collect all scoreable obstacle elements from the board (good, bad, or neutral).
 *
 * @param {HTMLElement} elBoard The board DOM element (e.g. .sr-board)
 * @returns {HTMLElement[]} Array of obstacle elements
 */
export function getObstacles(elBoard) {
	const elObstacles = [];
	elBoard
		?.querySelectorAll('.sr-obstacles[data-score]')
		?.forEach((elObstacle) => {
			elObstacle.querySelectorAll(':scope > *').forEach((elChild) => {
				// If this obstacle doesn't have a custom score then inherit it from the parent
				if (!elChild.hasAttribute('data-score')) {
					elChild.dataset.score = elObstacle.dataset.score;
				}
				elObstacles.push(elChild);
			});
		});
	return elObstacles;
}

/**
 * Find milestone targets and set their delay from parent or self (default 5000ms).
 *
 * @param {HTMLElement} elBoard The board DOM element (e.g. .sr-board)
 * @returns {HTMLElement[]} Array of milestone target elements
 */
export function setupMilestones(elBoard) {
	const elMilestones = [];
	elBoard
		?.querySelectorAll('.sr-milestones')
		?.forEach((elMilestoneGroup) => {
			elMilestoneGroup.querySelectorAll('.sr-milestone-target').forEach((elMilestoneTarget) => {
				const delay = Number(elMilestoneTarget.dataset.delay || elMilestoneGroup.dataset.delay || '5000');
				elMilestoneTarget.dataset.delay = String(delay);
				elMilestones.push(elMilestoneTarget);
			});
		});
	return elMilestones;
}

/**
 * For obstacles with data-rand, group by value and show one random element per group; hide the rest.
 *
 * @param {HTMLElement[]} elObstacles Array of obstacle elements (may have data-rand)
 */
export function handleRandomObstacles(elObstacles) {
	const elRandomObstacles = elObstacles.filter((obstacle) => obstacle.dataset?.rand);
	if (elRandomObstacles.length === 0) return;

	const groups = {};
	elRandomObstacles.forEach((el) => {
		const group = el.dataset.rand;
		if (!groups[group]) groups[group] = [];
		groups[group].push(el);
	});
	Object.values(groups).forEach((group) => {
		const rand = Math.floor(Math.random() * group.length);
		group.forEach((el, index) => {
			el.style.display = index !== rand ? 'none' : 'block';
		});
	});
}

/**
 * Return the board's next sibling element (the character wrapper).
 *
 * @param {HTMLElement} elBoard The board DOM element (e.g. .sr-board)
 * @returns {HTMLElement|undefined} The character container element or undefined
 */
export function getCharacter(elBoard) {
	return elBoard?.nextElementSibling ?? undefined;
}

/**
 * Enable drag-and-drop functionality for loading SVG level files
 *
 * @param {Object} props The properties object
 * @param {HTMLElement} props.elBoard The board DOM element
 * @param {HTMLElement} [props.elDropTarget] The element that should act as the drop target (defaults to elBoard)
 * @param {boolean} props.debug Debug mode
 * @param {{ current: import('gsap').Timeline[] }} props.timelinesRef Ref holding current timelines
 * @param {Function} props.setTimelines Simple setter (value) => void to set timelines in context
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
		timelinesRef,
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
					timelinesRef,
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
