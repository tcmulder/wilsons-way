import { useState, useEffect, useRef } from 'react';
import { GameContext } from './gameContext';

export function GameContextProvider({ children }) {
  const hasLoggedRef = useRef(false);
  const [debug] = useState(() => {
    if (typeof window === 'undefined') return null;
    const search = window.location.search || '';
    const params = new URLSearchParams(search);
    if (params.get('debug') !== '1') return null;
    const queryObject = {};
    params.forEach((value, key) => {
      queryObject[key] = value;
    });
    return queryObject;
  });
  const [status, setStatus] = useState({move: 'forward', jump: 'none', pause: 'pause'});
  const [level, setLevel] = useState(1);
  const [character, setCharacter] = useState({id: 1, el: null, timeline: null});
  const [timelines, setTimelines] = useState([]);
  const [jump, setJump] = useState({ height: 6, hangtime: 0.5 });
  const [settings, setSettings] = useState({});

  useEffect(() => {
    // Fetch settings from WordPress
    fetch(`${window.sr.api}shelf-runner/v1/settings`)
      .then(response => response.json())
      .then(d => {
        setSettings(d.data);
      })
      .catch(error => {
        console.error('Failed to fetch settings:', error);
      });
      // Log debug warning once if debug mode is enabled
      if (debug && !hasLoggedRef.current) {
        console.error('🐜 Debug mode is enabled: your scores will not be saved');
        hasLoggedRef.current = true;
      }
  }, [debug]);

  const value = {
    debug,
    status, setStatus,
    level, setLevel,
    character, setCharacter,
    timelines, setTimelines,
    settings, setSettings,
    jump, setJump,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}