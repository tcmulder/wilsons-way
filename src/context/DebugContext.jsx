import { useState, useEffect, useRef } from 'react';
import { DebugContext } from './useContexts';

/**
 * Get debug mode from URL query string
 * 
 * @param {Object} props The properties object
 * @param {React.ReactNode} props.children The children to render
 * @returns {React.ReactNode} The DebugContextProvider component
 */
export function DebugContextProvider({ children }) {
  // Get debug settings from query string
  const [debug] = useState(() => {
    // Bail if we can't read
    if (typeof window === 'undefined') return null;
    // Setup debug object
    const debugReturn = {};

    // Get the parameters and bail if debut is not true
    const search = window.location.search || '';
    const params = new URLSearchParams(search);
    if (params.get('debug') !== 'true') return null;

    // Setup our debug object
    params.forEach((value, key) => {
      let val;

      if (value === 'false') {
        // Treat explicit "false" as false
        val = false;
      } else if (value === 'true' || value === '') {
        // Treat explicit "true" or empty value (?foo) as true
        val = true;
      } else if (/^-?\d+(\.\d+)?$/.test(value)) {
        // Treat numeric strings (e.g. "5", "-3", "0.02") as numbers
        val = parseFloat(value);
      } else {
        // Fallback to string
        val = value;
      }
      // Add our value
      debugReturn[key] = val;
    });

    // Get rid of debug.debug (since the debug state is null anyway if debug is disabled)
    delete debugReturn.debug;

    // Send it!
    return debugReturn;
  });

  // Allow us to note debug mode once even in dev mode
  const oneRunRef = useRef(false);
  useEffect(() => {
    if (debug && !oneRunRef.current) {
      console.error('🐜 Debug mode is enabled: your scores will not be saved');
      oneRunRef.current = true;
    }
  }, [debug]);

  return (
    <DebugContext.Provider value={{ debug }}>
      {children}
    </DebugContext.Provider>
  );
}
