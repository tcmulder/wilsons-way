import { useState } from 'react';
import { LevelContext } from './useContexts';

export function LevelContextProvider({ children }) {
  const [level, setLevel] = useState(1);

  return (
    <LevelContext.Provider value={{ level, setLevel }}>
      {children}
    </LevelContext.Provider>
  );
}
