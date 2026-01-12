import { state } from './state.js';

/**
 * Load character
 *
 * @param {number}      jerseyNumber The number of the character to load
 * @param {HTMLElement} elAppender   The element to which we should append the character
 */
export const loadCharacter = async (
	jerseyNumber = 1,
	elAppender = state.elCharacter.firstElementChild,
) => {
	const {
		wp: { manifest, url },
	} = state;

	// Get the character's SVG from the manifest
	const svgPath = manifest[`src/svg/character-${jerseyNumber}.svg`];
	const svgUrl = `${url}${svgPath.file}`;

	// Load the character's SVG element
	try {
		const response = await fetch(svgUrl);
		const svgContent = await response.text();
		const parser = new DOMParser();
		const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
		const svg = svgDoc.documentElement;
		elAppender.replaceChildren(svg);
		return svg;
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('Error loading board SVG:', error);
	}
};

/**
 * Show a message above the character
 *
 * @param {string} message   The message to show
 * @param {string} className The class name to apply to the message (e.g. for negative/positive coloring)
 */
export const showCharacterMessage = (message, className) => {
	const { elCharacterScore } = state;
	const span = document.createElement('span');
	span.classList.add(className);
	span.textContent = message;
	span.addEventListener('animationend', () => {
		setTimeout(() => {
			span.remove();
		}, 300);
	});
	elCharacterScore.appendChild(span);
};
