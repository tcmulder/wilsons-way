import { state } from './state';

/**
 * Play or pause music
 */
export const toggleMusic = () => {
	const {
		sounds: { music, volumeMusic, volumeMaster, makeMusic, makeSound },
	} = state;
	// Bail if we shouldn't be making any noise
	if (!makeSound) {
		return;
	}
	// Play or pause music
	if (makeMusic) {
		music.loop = true;
		music.volume = volumeMusic * volumeMaster;
		music.currentTime = 0;
		music.play();
	} else if (makeSound) {
		music.pause();
	}
};

/**
 * Play or pause sound effects
 *
 * @param {string} sfxName Sound effect name
 */
export const toggleSFX = (sfxName) => {
	const {
		sounds: { sfx, volumeSFX, volumeMaster, makeSFX, makeSound },
	} = state;
	// Bail if we shouldn't be making any noise
	if (!makeSound) {
		return;
	}
	// Create a an Audio object and play it (allows multiple overlapping sfx)
	if (makeSFX) {
		const sound = sfx[sfxName]();
		sound.volume = volumeSFX * volumeMaster;
		sound.play();
	}
};
