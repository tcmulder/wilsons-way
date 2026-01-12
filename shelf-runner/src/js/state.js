/**
 * Establish globally shared state
 */
export const state = {};

/**
 * Set visual character state
 *
 * @param {Object} customState Key-value pairs of specific properties to update
 */
export const setCharacterState = (customState) => {
	const { elCharacter, status } = state;

	if (customState) {
		for (const key in customState) {
			if (customState.hasOwnProperty(key)) {
				status[key] = customState[key];
			}
		}
	}

	// Visually show the character's state
	for (const key in status) {
		if (status.hasOwnProperty(key)) {
			elCharacter.dataset[key] = status[key];
		}
	}
};

/**
 * Set the score
 *
 * @param {number}  amount Amount to add to the score
 * @param {boolean} addTo  Whether to add (true) or override (false) the score
 */
export const setScoreState = (amount, addTo = true) => {
	if (addTo) {
		state.score += amount;
	} else {
		state.score = amount;
	}

	// Visually show the score
	state.elScore.innerText = state.score.toLocaleString();
};
