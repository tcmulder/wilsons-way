import { useState, useMemo } from 'react';
import { TimelinesContext, SetTimelinesContext } from './useContexts';

export function TimelinesContextProvider({ children }) {
  const [timelines, setTimelines] = useState([]);
  const setTimelinesValue = useMemo(() => ({ setTimelines }), []);

  return (
    <TimelinesContext.Provider value={{ timelines, setTimelines }}>
      <SetTimelinesContext.Provider value={setTimelinesValue}>
        {children}
      </SetTimelinesContext.Provider>
    </TimelinesContext.Provider>
  );
}
