import { useRef, useMemo } from 'react';
import { GameplayContext } from './useContexts';

const initialEls = {
  elBoard: null,
  elCharacter: null,
  elCharacterCrashArea: null,
  elShelves: [],
  elObstacles: [],
  elObstaclesNegative: [],
};

export function GameplayContextProvider({ children }) {
  const timelinesRef = useRef([]);
  const elsRef = useRef(initialEls);

  const value = useMemo(
    () => ({
      timelinesRef,
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
