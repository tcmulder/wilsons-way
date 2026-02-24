import { useState } from 'react';
import { LevelContext } from './useContexts';

export function LevelContextProvider({ children }) {
  const [level, setLevel] = useState(1);
  const [currentLevelId, setCurrentLevelId] = useState(null);
  const [isLevelComplete, setIsLevelComplete] = useState(false);

  return (
    <LevelContext.Provider
      value={{
        level,
        setLevel,
        currentLevelId,
        setCurrentLevelId,
        isLevelComplete,
        setIsLevelComplete,
      }}
    >
      {children}
    </LevelContext.Provider>
  );
}
