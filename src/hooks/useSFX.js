import { useRef, useEffect } from 'react';

import { useSettingsContext } from '../context/useContexts';

import buffSound from '../mp3/buff.mp3';
import debuffSound from '../mp3/debuff.mp3';
import musicSound from '../mp3/music.mp3';
import negativeSound from '../mp3/negative.mp3';
import positiveSound from '../mp3/positive.mp3';

/**
 * Hook: background music and sound effects
 *
 * @returns {{ playSound: (name: 'positive'|'negative', shouldSound?: boolean) => void }}
 */
export const useGameAudio = () => {
	const musicRef = useRef(null);
	const soundsRef = useRef({});
	const { makeSFX, makeMusic, volume } = useSettingsContext();

	// Initialize background music and sound effects when the component mounts
	useEffect(() => {
		musicRef.current = new Audio(musicSound);
		musicRef.current.loop = true;
		soundsRef.current.positive = new Audio(positiveSound);
		soundsRef.current.negative = new Audio(negativeSound);
		soundsRef.current.buff = new Audio(buffSound);
		soundsRef.current.debuff = new Audio(debuffSound);
		return () => musicRef.current?.pause();
	}, []);

	// Sync music playback to makeMusic state
	useEffect(() => {
		const music = musicRef.current;
		if (!music) return;
		if (makeMusic) {
			music.loop = true;
			music.volume = 0.2 * volume;
			music.currentTime = 0;
			const p = music.play();
			// Prevent console error on initial load (NotAllowedError due to no user interaction)
			if (p && typeof p.catch === 'function') {
				p.catch(() => {
					window.addEventListener('keydown', () => music.play(), { once: true });
				});
			}
		} else {
			music.pause();
		}
	}, [makeMusic, volume]);

	// Play sound effect when SFX is turned on
	useEffect(() => {
		if (makeSFX && soundsRef.current.positive) {
			soundsRef.current.positive.volume = volume;
			const p = soundsRef.current.positive.play();
			// Prevent console error on initial load (NotAllowedError due to no user interaction)
			if (p && typeof p.catch === 'function') {
				p.catch(() => {});
			}
		}
	}, [makeSFX, volume]);

	/**
	 * Play a sound effect.
	 *
	 * @param {'positive'|'negative'} name Which effect to play.
	 * @param {boolean} [shouldSound] Override SFX enabled (defaults to makeSFX).
	 */
	const playSound = (name, shouldSound = makeSFX) => {
		if (!shouldSound) return;
		const audio = soundsRef.current[name];
		if (audio) {
			// By cloning we allow the same audio element to overlap itself
			const clone = audio.cloneNode();
			clone.volume = 0.9 * volume;
			const onEnded = () => {
				clone.removeEventListener('ended', onEnded);
				clone.src = '';
			};
			clone.addEventListener('ended', onEnded);
			clone.play();
		}
	};
  
	return { playSound };
  };