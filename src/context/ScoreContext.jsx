import { useState, useEffect } from 'react';
import { ScoreContext } from './useContexts';
import { useSettingsContext } from './useContexts';

/**
 * Provides score context.
 */
export function ScoreContextProvider({ children }) {
  const { settings } = useSettingsContext();
  const { userAdjustedLives } = settings;
  const [score, setScore] = useState([]);
  const [lives, setLives] = useState({ cur: userAdjustedLives, max: userAdjustedLives });

  // Setup lives from user's number of lives setting.
  useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLives({ cur: userAdjustedLives, max: userAdjustedLives });
  }, [userAdjustedLives]);

  return (
    <ScoreContext.Provider value={{ score, setScore, lives, setLives }}>
      {children}
    </ScoreContext.Provider>
  );
}
