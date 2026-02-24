import { useState } from 'react';
import { LevelContext } from './useContexts';

export function LevelContextProvider({ children }) {
  const [level, setLevel] = useState(1);
  const [currentLevelId, setCurrentLevelId] = useState(null);

  return (
    <LevelContext.Provider
      value={{
        level,
        setLevel,
        currentLevelId,
        setCurrentLevelId,
      }}
    >
      {children}
    </LevelContext.Provider>
  );
}
