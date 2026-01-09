import { state, setScoreState } from './state';
import { getNearest, checkOverlap, isTimelineEnd } from './utilities';
import { endLevel } from './level';
import { doPause } from './movement';
import { showCharacterMessage } from './characters';
import { toggleSFX } from './sounds';

/**
 * Apply scoring if an obstacle provides scoring data
 *
 * @param {HTMLElement} el The element to score (if it has scoring data)
 */
const checkCollisionScore = (el) => {
	const score = parseInt(el.dataset.score);
	const posOrNeg = score > 0 ? 'positive' : 'negative';
	if (score) {
		setScoreState(score, true);
		showCharacterMessage(
			`${posOrNeg === 'positive' ? '+' : ''}${score}`,
			`is-${posOrNeg}`,
		);
		if (state.sounds.makeSFX && state.sounds.makeSound) {
			toggleSFX(posOrNeg);
		}
	}
};

/**
 * Check for collisions
 *
 * @param {HTMLElement[]} els Elements to check
 */
const checkCollisions = (els) => {
	const { elCharacterCrashArea, collided } = state;
	els.forEach((el) => {
		if (
			!collided.has(el) &&
			!el.hasAttribute('data-disabled') &&
			checkOverlap(elCharacterCrashArea, el)
		) {
			collided.add(el);
			el.classList.add('is-collided');
			checkCollisionScore(el);
			checkCollisionMilestone(el);
			checkCollisionBonus(el);
		}
	});
};

/**
 * Check collision milestones
 *
 * @param {HTMLElement} el Milestone element to check
 */
const checkCollisionMilestone = (el) => {
	const { delayMilestone } = state;
	if (el.classList.contains('sr-milestone-target')) {
		const parent = el.parentElement;
		parent.classList.add('has-collided');
		doPause(true);
		state.timer = setTimeout(() => {
			doPause(false);
		}, delayMilestone);
	}
};

/**
 * Check collision bonuses
 *
 * @param {HTMLElement} el The element to check
 */
const checkCollisionBonus = (el) => {
	const { elObstaclesNegative, delayInvisible, status } = state;
	// If the bonus is invisibility then temporarily disable negative items (they will fade visually)
	if (el.dataset.bonus === 'invisible') {
		const disableNegativeEls = (delay = delayInvisible) => {
			elObstaclesNegative.forEach((obstacle) => {
				// If we respect this bonus then have it take effect
				if (!obstacle.dataset?.ignoreBonus?.split(',')?.includes('invisible')) {
					obstacle.setAttribute('data-disabled', '');
					setTimeout(() => {
						obstacle.removeAttribute('data-disabled');
						// Extend the bonus if paused (e.g. a milestone is open)
						if (status.pause === 'paused') {
							disableNegativeEls(delayInvisible / 2);
						}
					}, delay);
				}
			});
		};
		disableNegativeEls();
	}
};

/**
 * Track level completion
 */
const checkHitTheEnd = () => {
	if (isTimelineEnd()) {
		endLevel();
	}
};

/**
 * Track collisions
 */
export const trackCollisions = () => {
	const { elObstacles, status, isEnded } = state;

	// As we move check to see if we hit anything (mostly x axis)
	if (status.move !== 'none') {
		checkCollisions(elObstacles);
		checkHitTheEnd();
	}
	// If we're not jumping up then let gravity take us down
	if (status.jump !== 'up') {
		doGravity();
	}

	// Do this as fast and efficiently as possible
	if (!isEnded) {
		requestAnimationFrame(trackCollisions);
	}
};

/**
 * Allow falling off the edge of a shelf to the next one down
 */
export const doGravity = () => {
	const { elStage, elCharacter, elShelves } = state;
	const nearest = getNearest(elCharacter, elShelves, 'below');
	const stageRect = elStage.getBoundingClientRect();
	const nearestRect = nearest.getBoundingClientRect();
	const h = Math.ceil(
		((stageRect.bottom - nearestRect.top) / stageRect.height) * 100,
	);
	elCharacter.style.setProperty('--sr-h-shelf', `${h}cqh`);
};
