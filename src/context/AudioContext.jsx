import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { AudioContext } from './useContexts';

import buffSound from '../mp3/buff.mp3';
import debuffSound from '../mp3/debuff.mp3';
import level1Sound from '../mp3/level-1-music.mp3';
import level2Sound from '../mp3/level-2-music.mp3';
import level3Sound from '../mp3/level-3-music.mp3';
import level4Sound from '../mp3/level-4-music.mp3';
import negativeSound from '../mp3/negative.mp3';
import positiveSound from '../mp3/positive.mp3';

const musicTracks = {
  'level-1': level1Sound,
  'level-2': level2Sound,
  'level-3': level3Sound,
  'level-4': level4Sound,
};

/**
 * Owns audio preferences, persistent audio elements, and playback across route changes.
 */
export function AudioContextProvider({ children }) {
  // Single music element that outlives route changes so playback never restarts on navigation.
  const musicRef = useRef(null);
  // Tracks which level music key is currently loaded into musicRef.
  const activeTrackKeyRef = useRef(null);
  // Web Audio context + decoded buffers for low-latency one-shot SFX playback.
  const sfxContextRef = useRef(null);
  const sfxBuffersRef = useRef({});
  // User-controlled audio preferences.
  const [makeMusic, setMakeMusic] = useState(false);
  const [makeSFX, setMakeSFX] = useState(false);
  const [volume, setVolume] = useState(1);

  // Build audio elements once when the provider mounts; pause music only if the whole app unmounts.
  useEffect(() => {
    const music = new Audio();
    music.loop = true;
    // A page component's effect runs before this parent effect on first mount.
    // If useMusicTrack already stored a key, load that track now.
    if (activeTrackKeyRef.current) {
      music.src = musicTracks[activeTrackKeyRef.current];
      music.load();
    }
    musicRef.current = music;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) {
      return () => musicRef.current?.pause();
    }

    const context = new Ctx();
    sfxContextRef.current = context;

    const loadSound = async (name, url) => {
      const res = await fetch(url);
      const arrayBuffer = await res.arrayBuffer();
      sfxBuffersRef.current[name] = await context.decodeAudioData(arrayBuffer);
    };

    Promise.all([
      loadSound('positive', positiveSound),
      loadSound('negative', negativeSound),
      loadSound('buff', buffSound),
      loadSound('debuff', debuffSound),
    ]).catch(() => {});

    return () => {
      musicRef.current?.pause();
      sfxContextRef.current?.close().catch(() => {});
      sfxContextRef.current = null;
      sfxBuffersRef.current = {};
    };
  }, []);

  // Keep volume in sync without interrupting playback.
  useEffect(() => {
    if (musicRef.current) musicRef.current.volume = 0.2 * volume;
  }, [volume]);

  // Start/stop background music when the music preference changes.
  useEffect(() => {
    const music = musicRef.current;
    if (!music) return;
    if (makeMusic && activeTrackKeyRef.current) {
      music.loop = true;
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
  }, [makeMusic]);

  // Swap to a new music track; if it's already loaded, do nothing (no restart).
  const setMusicTrack = useCallback((trackKey) => {
    if (!musicTracks[trackKey]) return;
    if (activeTrackKeyRef.current === trackKey) return;

    // Always record the key first — the setup effect reads it on first mount
    // before musicRef.current exists (child effects fire before parent effects).
    activeTrackKeyRef.current = trackKey;

    const music = musicRef.current;
    if (!music) return;

    music.pause();
    music.src = musicTracks[trackKey];
    music.load();
    music.currentTime = 0;

    if (makeMusic) {
      music.loop = true;
      music.volume = 0.2 * volume;
      const p = music.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          window.addEventListener('keydown', () => music.play(), { once: true });
        });
      }
    }
  }, [makeMusic, volume]);

  // Stable callback consumers call to play a one-shot SFX (positive, negative, buff, debuff).
  const playSound = useCallback((name, shouldSound = makeSFX) => {
    if (!shouldSound) return;
    const context = sfxContextRef.current;
    const buffer = sfxBuffersRef.current[name];
    if (!context || !buffer) return;

    const playNow = () => {
      const source = context.createBufferSource();
      const gain = context.createGain();
      source.buffer = buffer;
      gain.gain.value = 0.9 * volume;
      source.connect(gain);
      gain.connect(context.destination);
      source.start(0);
    };

    if (context.state === 'suspended') {
      context.resume().then(playNow).catch(() => {});
      return;
    }

    playNow();
  }, [makeSFX, volume]);

  // Confirmation chirp when the user enables SFX or changes volume with SFX on.
  useEffect(() => {
    playSound('positive');
  }, [playSound]);

  // Memoized so consumers only re-render when the exposed API actually changes.
  const value = useMemo(
    () => ({ makeMusic, setMakeMusic, makeSFX, setMakeSFX, volume, setVolume, playSound, setMusicTrack }),
    [makeMusic, makeSFX, volume, playSound, setMusicTrack]
  );

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}
