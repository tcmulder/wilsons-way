import { useRef, useEffect } from 'react';
import positiveSound from '../mp3/positive.mp3';
import negativeSound from '../mp3/negative.mp3';
import musicSound from '../mp3/music.mp3';
import { useSettingsContext } from '../context/useContexts';

export const useGameAudio = () => {
	const musicRef = useRef(null);
	const soundsRef = useRef({});
	const { makeSFX, makeMusic } = useSettingsContext();

	useEffect(() => {
		// Initialize background music
		musicRef.current = new Audio(musicSound);
		musicRef.current.loop = true;
		
		// Preload sound effects
		soundsRef.current.positive = new Audio(positiveSound);
		soundsRef.current.negative = new Audio(negativeSound);
		
		return () => {
		// Cleanup
		musicRef.current?.pause();
		};
	}, []);

	// Sync music playback to makeMusic state
	useEffect(() => {
		const music = musicRef.current;
		if (!music) return;
		if (makeMusic) {
			music.loop = true;
			music.volume = 0.2;
			music.currentTime = 0;
			const p = music.play();
			// Prevent console error on initial load (NotAllowedError due to no user interaction)
			if (p && typeof p.catch === 'function') {
				p.catch(() => {
					window.addEventListener('keydown', () => {
						music.play();
					}, { once: true });
				});
			}
		} else {
			music.pause();
		}
	}, [makeMusic]);

	// Play sound effect when SFX is turned on (may be blocked by autoplay policy until user has interacted)
	useEffect(() => {
		if (makeSFX && soundsRef.current.positive) {
			const p = soundsRef.current.positive.play();
			// Prevent console error on initial load (NotAllowedError due to no user interaction)
			if (p && typeof p.catch === 'function') {
				p.catch(() => {});
			}
		}
	}, [makeSFX]);
  
	const playSound = (name, shouldSound = makeSFX) => {
		if (!shouldSound) return;
		const audio = soundsRef.current[name];
		if (audio) {
			const clone = audio.cloneNode();
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