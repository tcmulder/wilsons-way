import { useState, useMemo } from 'react';
import { GameplayContext } from './useContexts';

const initialStatus = { move: 'forward', jump: 'none', pause: 'pause' };
const initialCharacter = { id: 1, el: null, timeline: null };
const initialEls = {
  elBoard: null,
  elCharacter: null,
  elCharacterCrashArea: null,
  elShelves: [],
  elObstacles: [],
  elObstaclesNegative: [],
};

export function GameplayContextProvider({ children }) {
  const [status, setStatus] = useState(initialStatus);
  const [character, setCharacter] = useState(initialCharacter);
  const [timelines, setTimelines] = useState([]);
  const [els, setEls] = useState(initialEls);

  const setTimelinesStable = useMemo(() => ({ setTimelines }), []);

  const value = useMemo(
    () => ({
      status,
      setStatus,
      character,
      setCharacter,
      timelines,
      setTimelines,
      setTimelinesStable,
      els,
      setEls,
    }),
    [status, character, timelines, els, setTimelinesStable]
  );

  return (
    <GameplayContext.Provider value={value}>
      {children}
    </GameplayContext.Provider>
  );
}
