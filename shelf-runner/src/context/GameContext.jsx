import { useState } from 'react';
import { GameContext } from './gameContext';

export function GameContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [level, setLevel] = useState(1);

  const value = {
    user,
    setUser,
    theme,
    setTheme,
    level,
    setLevel,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
