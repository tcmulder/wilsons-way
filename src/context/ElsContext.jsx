import { useState } from 'react';
import { ElsContext } from './useContexts';

export function ElsContextProvider({ children }) {
  const [els, setEls] = useState({
    elBoard: null,
    elCharacter: null,
    elCharacterCrashArea: null,
    elShelves: [],
    elObstacles: [],
    elObstaclesNegative: [],
  });

  return (
    <ElsContext.Provider value={{ els, setEls }}>
      {children}
    </ElsContext.Provider>
  );
}
