import { useRef, useMemo } from 'react';
import { GameplayContext } from './useContexts';

export function GameplayContextProvider({ children }) {
  const timelinesRef = useRef([]);
  const elevationRef = useRef({
    above: 0,
    below: 0,
    floor: 0,
    ceiling: 0,
    head: 0,
    foot: 0,
  });
  const statusRef = useRef({
    move: 'backward',
    jump: 'none'
  });
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
      statusRef,
    }),
    []
  );

  return (
    <GameplayContext.Provider value={value}>
      {children}
    </GameplayContext.Provider>
  );
}
