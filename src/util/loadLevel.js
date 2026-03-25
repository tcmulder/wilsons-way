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
 * @returns {Element[]} Array of shelves
 */
export function getShelves(elBoard) {
	const elShelves = elBoard?.querySelectorAll('.sr-shelf') ?? [];
	return Array.from(elShelves);
}

/**
 * Collect all scoreable obstacle elements from the board (positive or negative)
 *
 * @param {HTMLElement} elBoard The board DOM element (e.g. .sr-board)
 * @returns {HTMLElement[]} Array of obstacle elements
 */
export function getObstacles(elBoard) {
	const elObstacles = elBoard?.querySelectorAll('.sr-obstacle') ?? [];
	return Array.from(elObstacles);
}

/**
 * Setup milestones.
 * 
 * A milestone (.sr-milestone) parent should have an .sr-obstacle (the collision trigger),
 * .sr-milestone-message (displayed when collided) and .sr-milestone-progress (a progress
 * bar animating the duration of display).
 *
 * @param {HTMLElement} elBoard The board DOM element (e.g. .sr-board)
 * @returns {void}
 */
export function setupMilestones(elBoard) {
	elBoard?.querySelectorAll('.sr-milestone')?.forEach((elMilestone, index) => {
		let id = `sr-milestone-id-${index}`;
		const elObstacle = elMilestone.querySelector('.sr-obstacle');
		const elMilestoneMessage = elMilestone.querySelector('.sr-milestone-message');
		if (elMilestoneMessage) {
			elMilestoneMessage.id = id;
			elObstacle.dataset.milestone = id;
			const elMilestoneProgress = elMilestone.querySelector('.sr-milestone-progress');
			if (elMilestoneProgress) {
				id = `${id}-progress`;
				elMilestoneProgress.id = id;
				elObstacle.dataset.milestoneProgress = id;
			}
		}
	});
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
