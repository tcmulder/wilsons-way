/**
 * Check to see if two elements overlap
 *
 * @param {HTMLElement} el1 First element to check
 * @param {HTMLElement} el2 Second element to check
 * @return {boolean} Whether or not the elements overlap
 */
const checkOverlap = (el1, el2) => {
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
 * Check for collisions
 *
 * @param {HTMLElement[]} els Elements to check
 * @param {HTMLElement} elCharacterCrashArea The character crash area element
 */
const checkCollisions = ({elCharacterCrashArea, elObstacles}) => {
	elObstacles.forEach((el) => {
		if (
			!el.classList.contains('sr-obstacle') &&
			!el.hasAttribute('data-disabled') &&
			checkOverlap(elCharacterCrashArea, el)
		) {
			el.classList.add('is-collided');
			// checkCollisionScore(el);
			// checkCollisionMilestone(el);
			// checkCollisionBonus(el);
		}
	});
};

// /**
//  * Apply scoring if an obstacle provides scoring data
//  *
//  * @param {HTMLElement} el The element to score (if it has scoring data)
//  */
// const checkCollisionScore = (el) => {
// 	const score = parseInt(el.dataset.score);
// 	const posOrNeg = score > 0 ? 'positive' : 'negative';
// 	if (score) {
// 		setScoreState(score, true);
// 		showCharacterMessage(
// 			`${posOrNeg === 'positive' ? '+' : ''}${score}`,
// 			`is-${posOrNeg}`,
// 		);
// 		if (state.sounds.makeSFX && state.sounds.makeSound) {
// 			toggleSFX(posOrNeg);
// 		}
// 	}
// };

// /**
//  * Check collision milestones
//  *
//  * @param {HTMLElement} el Milestone element to check
//  */
// const checkCollisionMilestone = (el) => {
// 	const { delayMilestone } = state;
// 	if (el.classList.contains('cq-milestone-target')) {
// 		const parent = el.parentElement;
// 		parent.classList.add('has-collided');
// 		doPause(true);
// 		state.timer = setTimeout(() => {
// 			doPause(false);
// 		}, delayMilestone);
// 	}
// };

// /**
//  * Check collision bonuses
//  *
//  * @param {HTMLElement} el The element to check
//  */
// const checkCollisionBonus = (el) => {
// 	const { elObstaclesNegative, delayInvisible, status } = state;
// 	// If the bonus is invisibility then temporarily disable negative items (they will fade visually)
// 	if (el.dataset.bonus === 'invisible') {
// 		const disableNegativeEls = (delay = delayInvisible) => {
// 			elObstaclesNegative.forEach((obstacle) => {
// 				// If we respect this bonus then have it take effect
// 				if (!obstacle.dataset?.ignoreBonus?.split(',')?.includes('invisible')) {
// 					obstacle.setAttribute('data-disabled', '');
// 					setTimeout(() => {
// 						obstacle.removeAttribute('data-disabled');
// 						// Extend the bonus if paused (e.g. a milestone is open)
// 						if (status.pause === 'paused') {
// 							disableNegativeEls(delayInvisible / 2);
// 						}
// 					}, delay);
// 				}
// 			});
// 		};
// 		disableNegativeEls();
// 	}
// };

/**
 * Track level completion
 */
const checkHitTheEnd = () => {
	// if (isTimelineEnd()) {
	// 	endLevel();
	// }
	return false;
};

// /**
//  * Allow falling off the edge of a shelf to the next one down
//  */
// export const doGravity = () => {
// 	const { elStage, elCharacter, elShelves, status, jumpTween, hangtime } =
// 		state;
// 	const nearest = getNearest(elCharacter, elShelves, 'below');
// 	const stageRect = elStage.getBoundingClientRect();
// 	const nearestRect = nearest.getBoundingClientRect();
// 	const charRect = elCharacter.getBoundingClientRect();

// 	// Calculate what the shelf height should be
// 	const h = Math.ceil(
// 		((stageRect.bottom - nearestRect.top) / stageRect.height) * 100,
// 	);

// 	// Calculate where the character currently is (in cqh units)
// 	const currentY = Math.ceil(
// 		((stageRect.bottom - charRect.bottom) / stageRect.height) * 100,
// 	);

// 	// Only update if character is not already on this shelf
// 	// Allow a small tolerance for floating point precision
// 	const tolerance = 1;
// 	if (Math.abs(currentY - h) < tolerance) {
// 		return;
// 	}

// 	elCharacter.style.setProperty('--cq-h-shelf', `${h}cqh`);

// 	// Update GSAP position when not jumping (so character follows shelf)
// 	if (status.jump === 'none' && !jumpTween) {
// 		const shelfPx = (h / 100) * stageRect.height;

// 		// If falling (character is above shelf), animate down
// 		if (currentY > h) {
// 			// Kill any existing gravity tween
// 			if (state.gravityTween) {
// 				state.gravityTween.kill();
// 			}
// 			// Calculate fall distance and duration (faster for shorter falls)
// 			const fallDistance = Math.abs(currentY - h);
// 			const fallDuration =
// 				Math.min((fallDistance / 100) * hangtime, hangtime) / 1000;

// 			state.gravityTween = gsap.to(elCharacter, {
// 				y: -shelfPx,
// 				duration: fallDuration,
// 				ease: 'power1.in',
// 				onComplete: () => {
// 					state.gravityTween = null;
// 				},
// 			});
// 		} else {
// 			// If character is below shelf (shouldn't happen), snap up
// 			gsap.set(elCharacter, { y: -shelfPx });
// 		}
// 	}
// };

/**
 * Track collisions
 * @param {Object} els The elements to check for collisions
 */
export const trackCollisions = (els) => {

	// Use closure to capture state and setter for recursive calls
	const checkTrackCollisions = () => {
		
		// Only check collisions when actually moving or jumping
		const shouldCheck = true;

		if (shouldCheck) {
			// As we move check to see if we hit anything (mostly x axis)
			checkCollisions(els);
				// checkHitTheEnd();
			// // If we're not jumping up then let gravity take us down
			// if (status.jump !== 'up') {
			// 	doGravity();
			// }
		}

		// Update closure with latest state before next frame (without causing re-render)
		// if (!isEnded && setLevelState) {
		// 	setLevelState((latestState) => {
		// 		currentState = latestState; // Update closure variable
		// 		return latestState; // Return unchanged to avoid re-render
		// 	});
		// }
		
		// Do this as fast and efficiently as possible
		const isEnded = false;
		if (!isEnded) {
			requestAnimationFrame(checkTrackCollisions);
		}
	};

	// Start the collision tracking loop
	checkTrackCollisions();
};