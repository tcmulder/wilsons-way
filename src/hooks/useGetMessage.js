import { useEffect, useState } from 'react';

/**
 * Fetches message text for a given key from the shelf-runner API.
 *
 * @param {string} messageKey Message key (e.g. level_1_intro).
 * @returns {string} Fetched message text (empty string until loaded).
 */
export function useGetMessage(messageKey) {
	const [message, setMessage] = useState('');

	useEffect(() => {
		fetch(`${window.sr.api}shelf-runner/v1/message/${messageKey}`)
			.then((response) => response.json())
			.then((data) => {
				setMessage(data.data.value);
			});
	}, [messageKey]);

	return message;
}
