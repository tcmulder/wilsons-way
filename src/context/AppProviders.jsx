import { DebugContextProvider } from './DebugContext';
import { SettingsContextProvider } from './SettingsContext';
import { LevelContextProvider } from './LevelContext';
import { GameplayContextProvider } from './GameplayContext';

export function AppProviders({ children }) {
  return (
    <DebugContextProvider>
      <SettingsContextProvider>
        <LevelContextProvider>
          <GameplayContextProvider>
            {children}
          </GameplayContextProvider>
        </LevelContextProvider>
      </SettingsContextProvider>
    </DebugContextProvider>
  );
}
