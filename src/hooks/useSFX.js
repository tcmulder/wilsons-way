import { useRef, useEffect } from 'react';
import positiveSound from '../mp3/positive.mp3';
import negativeSound from '../mp3/negative.mp3';
import musicSound from '../mp3/music.mp3';
import { useSettingsContext } from '../context/useContexts';

export const useGameAudio = () => {
	const musicRef = useRef(null);
	const soundsRef = useRef({});
	const { makeSFX } = useSettingsContext();

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
  
	const playSound = (name) => {
	  if (!makeSFX) return;
	  soundsRef.current[name]?.play();
	};
  
	const startMusic = () => {
	  musicRef.current?.play();
	};
  
	return { playSound, startMusic };
  };