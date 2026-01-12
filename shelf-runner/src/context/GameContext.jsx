import { useState } from 'react';
import { GameContext } from './gameContext';

export function GameContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  const value = {
    user,
    setUser,
    theme,
    setTheme
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
