import { useState } from 'react';
import { StatusContext } from './useContexts';

export function StatusContextProvider({ children }) {
  const [status, setStatus] = useState({ move: 'forward', jump: 'none', pause: 'pause' });

  return (
    <StatusContext.Provider value={{ status, setStatus }}>
      {children}
    </StatusContext.Provider>
  );
}
