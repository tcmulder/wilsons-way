import { state } from './state';

/**
 * Create a high score form
 *
 * @return {HTMLElement} The form container element
 */
const createForm = () => {
	const form = document.createElement('form');
	form.className = 'sr-form';
	form.autocomplete = 'off';

	const label = document.createElement('label');
	label.htmlFor = 'sr-username';
	label.textContent = 'Enter Your Name';

	const input = document.createElement('input');
	input.type = 'text';
	input.id = 'sr-username';
	input.name = 'username';
	input.required = true;
	input.maxLength = 6;

	const submit = document.createElement('button');
	submit.type = 'submit';
	submit.textContent = 'See Results';
	submit.classList.add('sr-button-yellow');
	submit.disabled = true;

	form.appendChild(label);
	form.appendChild(input);
	form.appendChild(submit);

	return form;
};

/**
 * Submit form data
 */
const submitForm = async () => {
	const {
		score,
		enableDebug,
		user,
		wp: { api, nonce },
	} = state;
	return fetch(`${api}shelf-runner/v1/winner/`, {
		method: 'POST',
		headers: {
			'X-WP-Nonce': nonce,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({ user, score, enableDebug }),
		credentials: 'same-origin',
	})
		.then((resp) => resp.json())
		.then((response) => {
			if (response?.data?.status === 200) {
				if (enableDebug) {
					// eslint-disable-next-line no-alert
					alert('Note: debug mode is active, so your score will not be saved.');
					// eslint-disable-next-line no-console
					console.log(response.data);
				}
				return true;
			}
			// eslint-disable-next-line no-console
			console.error('Error', response);
			return false;
		});
};

/**
 * Bind form controls
 *
 * This is for the dynamically-created form,
 * or we'd have added this to bindings.js.
 *
 * @param {HTMLElement} form The form container element
 * @return {Promise} Promise that resolves after form submission is complete
 */
const addFormControls = (form) => {
	return new Promise((resolve) => {
		const elInput = form.querySelector('input');
		const elSubmit = form.querySelector('button[type="submit"]');
		elInput.focus();
		elInput.addEventListener('input', (e) => {
			// Convert spaces to underscores
			e.target.value = e.target.value.replace(/ /g, '_');
			// Enable the submit button (unless the input is empty)
			elSubmit.disabled = e.target.value.trim() === '';
		});
		// Submit the form
		form.addEventListener('submit', async (e) => {
			e.preventDefault();
			state.user = elInput.value.trim();
			if (state.user) {
				const submission = await submitForm();
				if (submission) {
					resolve(); // Resolve the promise after leaderboard message is shown
				} else {
					alert('Form submission encountered an error: please try again.');
				}
			}
		});
	});
};

/**
 * Setup the score form
 * @return {Promise} Promise that resolves after form submission is complete
 */
export const doScoreForm = async () => {
	// Create the form
	const form = createForm();
	// Add the form within the winner message
	const elMessageWinner = [...state.elMessages].find(
		(msg) => msg.dataset.message === 'winner',
	);
	elMessageWinner.querySelector('.sr-message-scroller').append(form);
	// Bind controls to the form and return the promise
	return addFormControls(form);
};
