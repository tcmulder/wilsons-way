import { useState, useEffect } from 'react';
import { GameContext } from './gameContext';

export function GameContextProvider({ children }) {
  const [level, setLevel] = useState(1);
  const [character, setCharacter] = useState(1);
  const [timelines, setTimelines] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetch(`${window.sr.api}shelf-runner/v1/settings`)
      .then(response => response.json())
      .then(d => {
        setSettings(d.data);
      })
      .catch(error => {
        console.error('Failed to fetch settings:', error);
      });
  }, []);

  const value = {
    level, setLevel,
    character, setCharacter,
    timelines, setTimelines,
    settings, setSettings,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
