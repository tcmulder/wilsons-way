import { useState } from 'react';
import { CharacterContext } from './useContexts';

export function CharacterContextProvider({ children }) {
  const [characterId, setCharacterId] = useState(1);
  const [characterStatus, setCharacterStatus] = useState({ move: 'none', jump: 'none' });

  return (
    <CharacterContext.Provider value={{ characterId, setCharacterId, characterStatus, setCharacterStatus }}>
      {children}
    </CharacterContext.Provider>
  );
}
