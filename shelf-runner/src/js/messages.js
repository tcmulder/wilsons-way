import { state } from './state';
import { setRoster } from './roster';
import { doScoreForm } from './form';
import { setLeaderboard } from './leaderboard';
import { isWinner } from './utilities';

/**
 * Animate typing
 *
 * @param {HTMLElement} elMessage The parent message element
 */
const doType = (elMessage) => {
	const { delayTyping } = state;
	// Get the message to type
	const elMessageType = elMessage.querySelector('.sr-message-type');

	// Bail if we've nothing to type in
	if (!elMessageType) {
		return;
	}
	// Get the scroll container (so we can scroll down for long messages)
	const elMessageScroller = elMessage.querySelector('.sr-message-scroller');

	// Get ready to type
	elMessageType.classList.add('is-typing');

	// Process the message as HTML
	const message = elMessageType.innerHTML;
	const parser = new DOMParser();
	const doc = parser.parseFromString(message, 'text/html');
	const container = document.createElement('div');
	elMessageType.innerHTML = '';
	elMessageType.appendChild(container);

	const processNode = (node) => {
		if (node.nodeType === Node.TEXT_NODE) {
			const span = document.createElement('span');
			span.dataset.content = node.textContent;
			span.textContent = '';
			return span;
		} else if (node.nodeType === Node.ELEMENT_NODE) {
			const el = document.createElement(node.tagName);
			Array.from(node.attributes).forEach((attr) => {
				el.setAttribute(attr.name, attr.value);
			});
			Array.from(node.childNodes).forEach((child) => {
				el.appendChild(processNode(child));
			});
			return el;
		}
		return node.cloneNode(true);
	};

	// Build the DOM structure first
	Array.from(doc.body.childNodes).forEach((node) => {
		container.appendChild(processNode(node));
	});

	// Then animate the text
	const spans = container.querySelectorAll('span[data-content]');
	let currentSpan = 0;
	let currentChar = 0;

	const addChar = () => {
		if (currentSpan < spans.length) {
			const span = spans[currentSpan];
			const content = span.dataset.content;

			if (currentChar < content.length) {
				span.textContent += content[currentChar];
				currentChar++;
				// Scroll to bottom if needed to read the current line of text
				const scrollHeight = elMessageScroller.scrollHeight;
				const clientHeight = elMessageScroller.clientHeight;
				const maxScroll = scrollHeight - clientHeight;
				if (maxScroll > 0) {
					elMessageScroller.scrollTop = maxScroll;
				}
				setTimeout(addChar, delayTyping);
			} else {
				currentSpan++;
				currentChar = 0;
				addChar();
			}
		} else {
			// Identify typing animation as complete
			elMessageType.classList.remove('is-typing');
		}
	};
	// Show the typing animation
	addChar();
};

/**
 * Scroll a message (but allow disable)
 *
 * @param {HTMLElement} elMessage      The message element
 * @param {number}      durationScroll The duration of the scroll animation in milliseconds
 */
const doScroll = (elMessage, durationScroll = 10000) => {
	const elScroller = elMessage.querySelector('.sr-auto-scroller');
	if (elScroller && !elScroller.classList.contains('is-scrolling')) {
		elScroller.classList.add('is-scrolling');

		// Get the total scrollable distance
		const scrollHeight = elScroller.scrollHeight;
		const clientHeight = elScroller.clientHeight;
		const scrollDistance = scrollHeight - clientHeight;

		if (scrollDistance <= 0) {
			return; // No need to scroll if content fits in view
		}

		// Animation duration in milliseconds
		const startTime = performance.now();
		const startPosition = elScroller.scrollTop;

		// Flag to track if user has manually scrolled
		let userScrolled = false;

		// Detect user scroll
		const handleUserScroll = () => {
			userScrolled = true;
			// Remove the scroll event listener once user takes control
			elScroller.removeEventListener('wheel', handleUserScroll);
			elScroller.removeEventListener('touchmove', handleUserScroll);
			elScroller.removeEventListener('mousewheel', handleUserScroll);

			// Set a timer to restart scrolling
			clearTimeout(state.timer);
			state.timer = setTimeout(() => {
				// Calculate how much of the scroll has already been completed
				const scrolledPercentage =
					elScroller.scrollTop /
					(elScroller.scrollHeight - elScroller.clientHeight);
				const remainingDuration = durationScroll * (1 - scrolledPercentage);

				// Reset the user scrolled flag
				userScrolled = false;

				// Re-add the event listeners
				elScroller.addEventListener('wheel', handleUserScroll);
				elScroller.addEventListener('touchmove', handleUserScroll);
				elScroller.addEventListener('mousewheel', handleUserScroll);

				// Start a new scroll animation from the current position
				const newStartTime = performance.now();
				const newStartPosition = elScroller.scrollTop;
				const newScrollDistance =
					elScroller.scrollHeight - elScroller.clientHeight - newStartPosition;

				// Only restart if we haven't reached the bottom
				if (newScrollDistance > 5) {
					const continueScrollAnimation = (currentTime) => {
						// Stop animation if user has scrolled again
						if (userScrolled) {
							return;
						}

						const elapsed = currentTime - newStartTime;
						const progress = Math.min(elapsed / remainingDuration, 1);

						// Use linear progression
						const newPosition = newStartPosition + newScrollDistance * progress;
						elScroller.scrollTop = newPosition;

						// Continue animation if not complete
						if (progress < 1) {
							requestAnimationFrame(continueScrollAnimation);
						} else {
							// If we've reached the bottom wait a moment then restart game (if we have a restart button)
							setTimeout(() => {
								if (
									elScroller.scrollTop + elScroller.clientHeight >=
									elScroller.scrollHeight - 10
								) {
									elMessage.querySelector('.sr-restart')?.click();
								}
							}, state.delayInactive);
						}
					};

					// Start the continued animation
					requestAnimationFrame(continueScrollAnimation);
				}
			}, state.delayInactive);
		};

		// Add event listeners to detect user interaction
		elScroller.addEventListener('wheel', handleUserScroll);
		elScroller.addEventListener('touchmove', handleUserScroll);
		elScroller.addEventListener('mousewheel', handleUserScroll);

		// Animate scroll
		const scrollAnimation = (currentTime) => {
			// Stop animation if user has scrolled
			if (userScrolled) {
				return;
			}

			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / durationScroll, 1);

			// Use linear progression
			const newPosition = startPosition + scrollDistance * progress;
			elScroller.scrollTop = newPosition;

			// Continue animation if not complete
			if (progress < 1) {
				requestAnimationFrame(scrollAnimation);
			}
		};

		// Start the animation
		requestAnimationFrame(scrollAnimation);
	}
};

/**
 * Set a message's content and display it
 *
 * @param {string} name Message name (data-message value)
 */
export const setMessage = async (name) => {
	const { elMessages, enableMessages } = state;

	// Get the message by name
	const elMessage = [...elMessages].find((el) => el.dataset.message === name);

	return new Promise(async (resolve) => {
		// handle show/hide of the message
		const showMessage = (shouldShow = true) => {
			if (shouldShow) {
				elMessage.classList.add('is-active');
			} else {
				elMessage.classList.remove('is-active');
				return resolve();
			}
		};

		// Hide existing messages
		elMessages.forEach((el) => {
			el.classList.remove('is-active');
		});

		// Bail if messages are disabled
		if (!enableMessages) {
			return showMessage(false);
		}

		// Show the message box
		showMessage();

		// Maybe show the high score frome
		if (name === 'winner') {
			await doScoreForm();
			return resolve();
		}

		// Either close message on click of a button or on
		elMessage.addEventListener('click', (e) => {
			if (e.target.hasAttribute('data-message-resolve')) {
				showMessage(false);
			}
		});
	});
};

/**
 * Display the game intro
 *
 * @return {Promise} Resolves to move on to level 1
 */
export const setIntro = async () => {
	return new Promise(async (resolve) => {
		// Show the character selection roster
		setRoster();
		// Show the message
		await setMessage('intro');
		// Resolve once the message has closed
		return resolve();
	});
};

/**
 * Set winner/loser message
 */
export const setWinOrLoseMessage = async () => {
	const { level, elProgressLevels } = state;
	// Identify that we're at the end of the game (so we don't track collisions)
	state.isEnded = true;

	// Show the "current day" text as being completed
	elProgressLevels[level.current - 1].nextElementSibling.classList.add(
		'has-progress',
	);
	// Show the winner or loser content
	if (isWinner()) {
		await setMessage('winner');
		await setMessage('leaderboard');
		await setMessage('outro');
	} else {
		await setMessage('loser');
		await setMessage('leaderboard');
		await setMessage('outro');
	}
};

/**
 * Run functions on activation of specific messages
 */
export const setMessageActions = () => {
	const { elMessages } = state;

	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			if (
				mutation.type === 'attributes' &&
				mutation.attributeName === 'class' &&
				mutation.target.classList.contains('is-active')
			) {
				// Type out text if has data-message-has-type attribute
				if (mutation.target.hasAttribute('data-message-has-type')) {
					doType(mutation.target);
				}
				// Show leaderboard
				if (mutation.target.dataset.message === 'leaderboard') {
					setLeaderboard();
				}
				// Scroll final screen
				if (mutation.target.hasAttribute('data-message-has-autoscroll')) {
					doScroll(mutation.target, state.delayOutroScroll);
				}
			}
		});
	});

	elMessages.forEach((elMessage) => {
		observer.observe(elMessage, { attributes: true });
	});
};
