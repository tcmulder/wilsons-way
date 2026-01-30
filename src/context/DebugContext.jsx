import { useState, useEffect, useRef } from 'react';
import { DebugContext } from './useContexts';

export function DebugContextProvider({ children }) {
  const hasLoggedRef = useRef(false);
  const [debug] = useState(() => {
    if (typeof window === 'undefined') return null;
    const search = window.location.search || '';
    const params = new URLSearchParams(search);
    if (params.get('debug') !== '1') return null;
    const queryObject = {};
    params.forEach((value, key) => {
      queryObject[key] = value;
    });
    return queryObject;
  });

  useEffect(() => {
    if (debug && !hasLoggedRef.current) {
      console.error('🐜 Debug mode is enabled: your scores will not be saved');
      hasLoggedRef.current = true;
    }
  }, [debug]);

  return (
    <DebugContext.Provider value={{ debug }}>
      {children}
    </DebugContext.Provider>
  );
}
