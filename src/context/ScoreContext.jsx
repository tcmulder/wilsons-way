import { useState } from 'react';
import { ScoreContext } from './useContexts';

export function ScoreContextProvider({ children }) {
  const [score, setScore] = useState([]);

  return (
    <ScoreContext.Provider value={{ score, setScore }}>
      {children}
    </ScoreContext.Provider>
  );
}
