import { state } from './state';
import { loadCharacter } from './characters';
import { convertClassToData } from './utilities';

/**
 * Set the roster for selecting a character.
 */
export const setRoster = () => {
	const { elRosterCharacters } = state;

	elRosterCharacters.forEach(async (elRosterButton, i) => {
		const jerseyNumber = parseInt(elRosterButton.dataset.character);
		const svg = await loadCharacter(
			jerseyNumber,
			elRosterButton.querySelector('.sr-roster-svg'),
		);
		convertClassToData(svg);
		const nameElement = svg.querySelector('[data-name]');
		if (nameElement) {
			const dataName = nameElement.getAttribute('data-name');
			if (dataName) {
				const lastChild = elRosterButton.lastElementChild;
				if (lastChild) {
					lastChild.textContent += ` ${dataName}`;
				}
			}
		}
		elRosterButton.addEventListener('click', (e) => {
			e.stopPropagation();
			state.character = jerseyNumber;
			elRosterCharacters.forEach((btn) => btn.classList.remove('is-active'));
			elRosterButton.classList.add('is-active');
		});
		if (i === state.character - 1) {
			elRosterButton.classList.add('is-active');
		}
	});
};
