import { state } from './state';
import { doRun, doJump, doStop, doBackslide } from './movement';
import { showLeaderboard } from './leaderboard';
import { getParam } from './utilities';
import { toggleMusic, toggleSFX } from './sounds';

/**
 * Bind actions to controls
 */
export const bindControls = () => {
	/**
	 * Interface controls
	 */

	// Sound effects toggle (disabled if !state.sounds.makeSounds)
	state.elControlToggleSFX?.addEventListener('change', () => {
		const isOn = state.elControlToggleSFX.checked;
		state.sounds.makeSFX = isOn;
		toggleSFX(isOn ? 'positive' : null);
	});

	// Music toggle (disabled if !state.sounds.makeSounds)
	state.elControlToggleMusic?.addEventListener('change', () => {
		const isOn = state.elControlToggleMusic.checked;
		state.sounds.makeMusic = isOn;
		toggleMusic();
	});

	// Restart all levels button
	state.elControlRestarts.forEach((elControlRestart) => {
		elControlRestart.addEventListener('click', (e) => {
			e.stopPropagation();
			location.reload();
		});
	});

	// Temporarily show leaderboard via button
	state.elControlLeaderboard.addEventListener('click', async () => {
		showLeaderboard();
	});

	/**
	 * Gameplay controls
	 */

	// Touch device jumping (when click anywhere on the screen even outside of elBoard/elStage)
	document.addEventListener('touchstart', () => {
		doJump();
	});

	// Character movement
	document.addEventListener('keydown', (e) => {
		// Jump on space bar or up click
		if (e.key === 'ArrowUp' || e.key === ' ') {
			e.preventDefault();
			doJump();
			// Move forward (if free range mode is activated)
		} else if (e.key === 'ArrowRight') {
			if (!state.enableAutoplay) {
				e.preventDefault();
				doRun();
			}
			// Move backward (if free range mode is activated)
		} else if (e.key === 'ArrowLeft') {
			if (!state.enableAutoplay) {
				e.preventDefault();
				doBackslide();
			}
		}
	});

	// Simulated autoplay/stop (if free range mode is activated)
	document.addEventListener('keyup', (e) => {
		if (getParam('autoplay') !== '0') {
			return;
		}
		if (e.key === 'ArrowDown') {
			if (state.status.move === 'none') {
				e.preventDefault();
				doRun();
			} else {
				e.preventDefault();
				doStop();
			}
		} else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
			e.preventDefault();
			doStop();
		}
	});

	// Simulated autoplay/stop on two finger touch(if free range mode is activated)
	state.elBoard.addEventListener(
		'touchstart',
		(e) => {
			if (e.touches.length === 2 && getParam('autoplay') === '0') {
				if (state.status.move === 'none') {
					doRun();
				} else {
					doStop();
				}
			}
		},
		{ passive: true },
	);
};
