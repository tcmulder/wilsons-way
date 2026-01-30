import { useState } from 'react';
import { CharacterContext } from './useContexts';

export function CharacterContextProvider({ children }) {
  const [character, setCharacter] = useState({ id: 1, el: null, timeline: null });

  return (
    <CharacterContext.Provider value={{ character, setCharacter }}>
      {children}
    </CharacterContext.Provider>
  );
}
