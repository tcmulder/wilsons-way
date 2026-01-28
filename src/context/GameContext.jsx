import { useState, useEffect, useRef } from 'react';
import { GameContext } from './gameContext';

export function GameContextProvider({ children }) {
  const hasLoggedRef = useRef(false);
  const [debug, setDebug] = useState(null);
  const [status, setStatus] = useState({move: 'forward', jump: 'none', pause: 'pause'});
  const [level, setLevel] = useState(1);
  const [character, setCharacter] = useState({id: 1, el: null, timeline: null});
  const [timelines, setTimelines] = useState([]);
  const [jump, setJump] = useState({ height: 2, hangtime: 1 });
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
      // Set debug mode if debug=1 is in the query string
      if (window.location.search.includes('debug=1')) {
        if (!hasLoggedRef.current) {
          console.error('🐜 Debug mode is enabled: your scores will not be saved');
          hasLoggedRef.current = true;
        }
        setDebug(true);
      }
  }, []);

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