import { useState } from 'react';
import { ElevationContext } from './useContexts';

export function ElevationContextProvider({ children }) {
  const [elevation, setElevation] = useState({ above: 100, below: 0 });

  return (
    <ElevationContext.Provider value={{ elevation, setElevation }}>
      {children}
    </ElevationContext.Provider>
  );
}
