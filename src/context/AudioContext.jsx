import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { AudioContext } from './useContexts';

import buffSound from '../mp3/buff.mp3';
import debuffSound from '../mp3/debuff.mp3';
import musicSound from '../mp3/music.mp3';
import negativeSound from '../mp3/negative.mp3';
import positiveSound from '../mp3/positive.mp3';

/**
 * Owns audio preferences, persistent audio elements, and playback across route changes.
 */
export function AudioContextProvider({ children }) {
  // Single music element that outlives route changes so playback never restarts on navigation.
  const musicRef = useRef(null);
  // Preloaded SFX elements; cloned per-play so overlapping sounds don't cut each other off.
  const soundsRef = useRef({});
  // User-controlled audio preferences.
  const [makeMusic, setMakeMusic] = useState(false);
  const [makeSFX, setMakeSFX] = useState(false);
  const [volume, setVolume] = useState(1);

  // Build audio elements once when the provider mounts; pause music only if the whole app unmounts.
  useEffect(() => {
    musicRef.current = new Audio(musicSound);
    musicRef.current.loop = true;
    soundsRef.current.positive = new Audio(positiveSound);
    soundsRef.current.negative = new Audio(negativeSound);
    soundsRef.current.buff = new Audio(buffSound);
    soundsRef.current.debuff = new Audio(debuffSound);

    return () => musicRef.current?.pause();
  }, []);

  // Start/stop background music when the music preference or volume changes.
  useEffect(() => {
    const music = musicRef.current;
    if (!music) return;

    if (makeMusic) {
      music.loop = true;
      music.volume = 0.2 * volume;
      music.currentTime = 0;
      const p = music.play();
      // If autoplay is blocked (no user interaction yet), retry on the first keydown.
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          window.addEventListener('keydown', () => music.play(), { once: true });
        });
      }
    } else {
      music.pause();
    }
  }, [makeMusic, volume]);

  // Stable callback consumers call to play a one-shot SFX (positive, negative, buff, debuff).
  const playSound = useCallback((name, shouldSound = makeSFX) => {
    if (!shouldSound) return;
    const audio = soundsRef.current[name];
    if (audio) {
      const clone = audio.cloneNode();
      clone.volume = 0.9 * volume;
      const onEnded = () => {
        clone.removeEventListener('ended', onEnded);
        clone.src = '';
      };
      clone.addEventListener('ended', onEnded);
      clone.play();
    }
  }, [makeSFX, volume]);

  // Confirmation chirp when the user enables SFX or changes volume with SFX on.
  useEffect(() => {
    playSound('positive');
  }, [playSound]);

  // Memoized so consumers only re-render when the exposed API actually changes.
  const value = useMemo(
    () => ({ makeMusic, setMakeMusic, makeSFX, setMakeSFX, volume, setVolume, playSound }),
    [makeMusic, makeSFX, volume, playSound]
  );

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}
