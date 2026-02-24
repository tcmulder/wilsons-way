import { useState } from 'react';
import { ScoreContext } from './useContexts';

/**
 * Provides score context.
 */
export function ScoreContextProvider({ children }) {
  const [score, setScore] = useState([]);

  return (
    <ScoreContext.Provider value={{ score, setScore }}>
      {children}
    </ScoreContext.Provider>
  );
}
