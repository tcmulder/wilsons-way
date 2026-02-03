import { useState, useEffect } from 'react';
import { SettingsContext } from './useContexts';

export function SettingsContextProvider({ children }) {
  const [settings, setSettings] = useState({});
  const [jump, setJump] = useState({ height: 15, hangtime: 0.5 });

  useEffect(() => {
    fetch(`${window.sr.api}shelf-runner/v1/settings`)
      .then(response => response.json())
      .then(d => {
        setSettings(d.data);
      })
      .catch(error => {
        console.error('Failed to fetch settings:', error);
      });
  }, []);

  const value = { settings, setSettings, jump, setJump };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
