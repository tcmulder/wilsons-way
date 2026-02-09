import { useState, useEffect } from 'react';
import { SettingsContext, useGameplayContext } from './useContexts';

export function SettingsContextProvider({ children }) {
  const [settings, setSettings] = useState({});
  const [jump, setJump] = useState({ height: 0, hangtime: 0 });
  const { elevationRef } = useGameplayContext();

  useEffect(() => {
    fetch(`${window.sr.api}shelf-runner/v1/settings`)
      .then(response => response.json())
      .then(d => {
        setSettings(d.data);
        if (elevationRef.current?.ceiling) {
          setJump({
            height: elevationRef.current.ceiling * (d.data.jumpHeight / 100),
            hangtime: d.data.jumpHangtime
          });
        }
      })
      .catch(error => {
        console.error('Failed to fetch settings:', error);
      });
  }, [elevationRef]);

  const value = { settings, setSettings, jump, setJump };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}
