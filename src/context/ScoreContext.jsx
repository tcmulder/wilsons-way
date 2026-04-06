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

  // Seed lives from settings.
  useEffect(() => {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLives((prev) => {
        // Don't overwrite lives if they've already been set.
        if (prev?.max != null) return prev;
        // Initialize lives from settings.
        return { cur: userAdjustedLives, max: userAdjustedLives };
      });
  }, [userAdjustedLives]);

  return (
    <ScoreContext.Provider value={{ score, setScore, lives, setLives }}>
      {children}
    </ScoreContext.Provider>
  );
}
