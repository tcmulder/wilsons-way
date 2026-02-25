import { useState } from 'react';
import { LevelContext } from './useContexts';

/**
 * Provides level context.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children The children to render
 * @returns {React.ReactNode} The LevelContextProvider component
 */
export function LevelContextProvider({ children }) {
  const [level, setLevel] = useState(1);
  const [currentLevelId, setCurrentLevelId] = useState(null);
  const [customLevelSvg, setCustomLevelSvg] = useState(null);

  return (
    <LevelContext.Provider
      value={{
        level,
        setLevel,
        currentLevelId,
        setCurrentLevelId,
        customLevelSvg,
        setCustomLevelSvg,
      }}
    >
      {children}
    </LevelContext.Provider>
  );
}
