import { useState } from 'react';
import { GameContext } from './gameContext';

export function GameContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [level, setLevel] = useState(1);
  const [timelines, setTimelines] = useState([]);
  const [gameplayDuration, setGameplayDuration] = useState(30);

  const value = {
    user,
    setUser,
    theme,
    setTheme,
    level,
    setLevel,
    timelines,
    setTimelines,
    gameplayDuration,
    setGameplayDuration,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
