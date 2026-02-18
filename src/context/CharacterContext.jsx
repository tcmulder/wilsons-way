import { useState } from 'react';
import { CharacterContext } from './useContexts';

export function CharacterContextProvider({ children }) {
  const [characterId, setCharacterId] = useState(1);
  const [characterStatus, setCharacterStatus] = useState({ move: 'forward', jump: 'none', ani: 'none' });
  const [characterModifiers, setCharacterModifiers] = useState([]);

  return (
    <CharacterContext.Provider value={{
      characterId,
      setCharacterId,
      characterStatus,
      setCharacterStatus,
      characterModifiers,
      setCharacterModifiers,
    }}>
      {children}
    </CharacterContext.Provider>
  );
}
