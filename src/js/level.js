import { state } from './state';
import { setup } from './init';
import { convertClassToData, countdown, getSVGFromURL } from './utilities';
import { setMessage, setWinOrLoseMessage } from './messages';
import { doRun, doPause } from './movement';

/**
 * Start a specific level
 *
 * @param {number} targetLevel The level number
 */
export const setLevel = async (targetLevel) => {
	const {
		enableMessages,
		wp: { manifest, url },
		elProgressLevels,
		level,
	} = state;

	// Bail if this is the last level (i.e. there is no next level to load)
	if (targetLevel > state.level.total) {
		return;
	}

	// Clear any active timers
	clearTimeout(state.timer);

	// Update progress indicators
	elProgressLevels.forEach((progressLevel) => {
		const levelNum = parseInt(progressLevel.dataset.level);
		if (levelNum <= level.current) {
			progressLevel.classList.add('has-progress');
		} else {
			progressLevel.classList.remove('has-progress');
		}
	});

	// Load the new SVG game board
	const svgPath = manifest[`src/svg/level-${targetLevel}.svg`];
	const svgUrl = `${url}${svgPath.file}`;
	const elSVG = await getSVGFromURL(svgUrl);
	await loadSvgLevel(elSVG);

	// Maybe show the message for the level we just loaded
	if (enableMessages) {
		await setMessage(`level-${targetLevel}-intro`);
	}
	// Setup the level
	setup();
	// After our message has closed (or is never shown) then maybe begin autoplay
	if (state.enableAutoplay) {
		countdown(3, () => {
			doPause(false);
			doRun();
		});
	}
};

/**
 * Load an SVG level file
 *
 * @param {string} elSVG SVG element
 * @return {Promise<SVGElement>} Promise that resolves to the loaded SVG element
 */
export const loadSvgLevel = async (elSVG) => {
	state.elBoard.replaceChildren(elSVG);
	convertClassToData(elSVG);

	// Move any parallax layers to their own SVG graphics for better animation performance
	const elParallaxes = Array.from(
		elSVG.querySelectorAll('[data-parallax]'),
	).reverse();
	state.elStageProps = [];
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
			state.elBoard.prepend(newSVG);
		} else {
			state.elBoard.appendChild(newSVG);
		}
		state.elStageProps.push(newSVG);
		// Remove the original parallax element from the main SVG
		elParallax.remove();
	});
	// Return the SVG element after all operations are complete
	return elSVG;
};

/**
 * End a current level (then request next level or end the game as appropriate)
 */
export const endLevel = async () => {
	const { level } = state;
	doPause();
	if (level.current < level.total) {
		await setMessage(`level-${level.current}-outro`);
		level.current = level.current + 1;
		setLevel(level.current);
	} else {
		setWinOrLoseMessage();
	}
};
