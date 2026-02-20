import { useState, useEffect } from 'react';
import { SettingsContext } from './useContexts';

export function SettingsContextProvider({ children }) {
  const [settings, setSettings] = useState({});
  const [jump, setJump] = useState({ height: 0, hangtime: 0 });
  const [makeMusic, setMakeMusic] = useState(false);
  const [makeSFX, setMakeSFX] = useState(false);

  useEffect(() => {
    fetch(`${window.sr.api}shelf-runner/v1/settings`)
      .then(response => response.json())
      .then(d => {
        setSettings(d.data);
        setJump({
          height: (d.data.jumpHeight), // Percentage like 0 - 1.
          hangtime: d.data.jumpHangtime // In seconds.
        });
      })
      .catch(error => {
        console.error('Failed to fetch settings:', error);
      });
  }, []);

  const value = { settings, setSettings, jump, setJump, makeMusic, setMakeMusic, makeSFX, setMakeSFX };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
