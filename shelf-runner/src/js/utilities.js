import { state } from './state';

/**
 * Get the nearest element above or below an element
 *
 * @param {HTMLElement}     el        Element to look from
 * @param {HTMLElement[]}   els       Elements from which to determine nearest
 * @param {"above"|"below"} direction Direction to look for nearest element
 * @return {HTMLElement|null} The nearest element or null if none found
 */
export const getNearest = (el, els, direction) => {
	if (!el || !els?.length) {
		return null;
	}
	const charRect = el.getBoundingClientRect();
	// Default to first element (ground floor) if we're looking down
	let nearest = direction === 'below' ? els[0] : null;

	// Filter shelves that overlap with the element
	const xOverlaps = [...els].filter((shelf) => {
		const shelfRect = shelf.getBoundingClientRect();
		return shelfRect.left < charRect.right && shelfRect.right > charRect.left;
	});

	// If we find overlaps then find the nearest one in the direction we're looking
	if (xOverlaps.length > 0) {
		const nearestInDirection = xOverlaps.reduce((closest, shelf) => {
			const shelfRect = shelf.getBoundingClientRect();
			const isBelow = direction === 'below';

			if (
				isBelow
					? shelfRect.top < charRect.bottom
					: shelfRect.bottom > charRect.top
			) {
				return closest;
			}

			if (!closest) {
				return shelf;
			}

			const closestRect = closest.getBoundingClientRect();
			// eslint-disable-next-line no-nested-ternary
			return isBelow
				? shelfRect.top < closestRect.top
					? shelf
					: closest
				: shelfRect.bottom > closestRect.bottom
					? shelf
					: closest;
		}, null);
		nearest = nearestInDirection || nearest;
	}

	// Send it!
	return nearest;
};

/**
 * Check to see if two elements overlap
 *
 * @param {HTMLElement} el1 First element to check
 * @param {HTMLElement} el2 Second element to check
 * @return {boolean} Whether or not the elements overlap
 */
export const checkOverlap = (el1, el2) => {
	const rect1 = el1.getBoundingClientRect();
	const rect2 = el2.getBoundingClientRect();
	return (
		rect1.left < rect2.right &&
		rect1.right > rect2.left &&
		rect1.top < rect2.bottom &&
		rect1.bottom > rect2.top
	);
};

/**
 * Convert classes to data attributes
 *
 * We're using a Figma plugin that can export
 * SVG graphics with class names, but we want
 * data attributes. Should we stop using that
 * plugin, we could remove this and simply add
 * data attributes manually.
 *
 * @param {HTMLElement} elContainer The stage element to look within
 */
export const convertClassToData = (elContainer) => {
	elContainer.querySelectorAll('[class*="["')?.forEach((el) => {
		el.classList.forEach((className) => {
			if (className.startsWith('[')) {
				const pairs = className.substring(1).replace(/]/g, '').split('[');
				pairs.forEach((pair) => {
					const [key, value] = pair.split(':');
					el.setAttribute(`data-${key}`, value || '');
				});
				el.classList.remove(className);
				if (!el.classList.length) {
					el.removeAttribute('class');
				}
			}
		});
	});
};

/**
 * Run a countdown that executes a callback when complete
 *
 * @param {number}   n        Number of seconds to count down from
 * @param {Function} callback Function to execute when countdown completes
 */
export const countdown = (n = 3, callback) => {
	const { elCountdown } = state;
	if (n === 0) {
		elCountdown.innerHTML = '';
		callback();
	} else {
		elCountdown.innerHTML = `<span>${n}</span>`;
		state.timer = setTimeout(
			() => countdown(n - 1, callback),
			state.delayCountdown,
		);
	}
};

/**
 * Get a query param value from the URL
 *
 * @param {string} param Parameter name to get the value of
 * @return {string|null} Parameter value or null if not found
 */
export const getParam = (param) => {
	return new URL(location.href).searchParams.get(param);
};

/**
 * Determine if we're at the end of the timeline
 */
export const isTimelineEnd = () => {
	const { timelines } = state;
	const cur = timelines.board.currentTime;
	const total = Math.floor(timelines.board.effect.getTiming().duration);
	return total > 0 && cur >= total;
};

/**
 * Determine if we're at the start of the timeline
 */
export const isTimelineStart = () => {
	const { timelines } = state;
	return Math.floor(timelines.board.currentTime) <= 0;
};

/**
 * Determine if it's a win/loss score
 */
export const isWinner = () => {
	const {
		score,
		wp: { scores },
	} = state;
	const low = scores.reduce((a, b) => Math.min(a, b.score), 0);
	return score >= low;
};

/**
 * Get an SVG's width from viewBox
 *
 * @param {HTMLElement} elSVG SVG element
 * @return {number} Width of the SVG
 */
export const getSvgWidth = (elSVG) => {
	return parseInt(elSVG.getAttribute('viewBox').split(' ')[2]);
};

/**
 * Get an SVG from URL
 *
 * @param {string} svgUrl Path to the SVG file
 */
export const getSVGFromURL = async (svgUrl) => {
	try {
		const response = await fetch(svgUrl);
		const svgContent = await response.text();
		const parser = new DOMParser();
		const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
		const elSVG = svgDoc.documentElement;
		return elSVG;
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('Error loading board SVG:', error);
		// Reject the promise with the error
		throw error;
	}
};
