import '../css/index.css';
import { init } from './init.js';

/**
 * Load the game on page load
 */
window.addEventListener('load', () => {
	init(document.querySelector('.sr-stage'));
});
