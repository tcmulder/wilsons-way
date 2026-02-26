import { useRef, useMemo } from 'react';
import { GameplayContext } from './useContexts';

/**
 * Provides context related to gameplay.
 */
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
  const jumpRef = useRef({
    height: 0,
    hangtime: 0,
  });
  const statusRef = useRef({
    move: 'none',
    jump: 'none',
    ani: 'none',
  });
  const elsRef = useRef({
    elBoard: null,
    elCharacter: null,
    elCharacterCrashArea: null,
    elCharacterMessage: null,
    elShelves: [],
    elObstacles: [],
    elShelvesVisible: new Set(),
    elObstaclesVisible: new Set(),
  });

  const value = useMemo(
    () => ({
      timelinesRef,
      elevationRef,
      jumpRef,
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
