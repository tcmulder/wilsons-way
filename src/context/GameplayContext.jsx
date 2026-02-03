import { useRef, useMemo } from 'react';
import { GameplayContext } from './useContexts';

export function GameplayContextProvider({ children }) {
  const timelinesRef = useRef([]);
  const elevationRef = useRef({ above: 1, below: 0 });
  const elsRef = useRef({
    elBoard: null,
    elCharacter: null,
    elCharacterCrashArea: null,
    elShelves: [],
    elObstacles: [],
    elObstaclesNegative: [],
  });

  const value = useMemo(
    () => ({
      timelinesRef,
      elevationRef,
      elsRef,
    }),
    []
  );

  return (
    <GameplayContext.Provider value={value}>
      {children}
    </GameplayContext.Provider>
  );
}
