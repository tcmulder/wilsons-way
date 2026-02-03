import { DebugContextProvider } from './DebugContext';
import { SettingsContextProvider } from './SettingsContext';
import { LevelContextProvider } from './LevelContext';
import { CharacterContextProvider } from './CharacterContext';
import { GameplayContextProvider } from './GameplayContext';

export function AppProviders({ children }) {
  return (
    <DebugContextProvider>
      <SettingsContextProvider>
        <LevelContextProvider>
          <CharacterContextProvider>
            <GameplayContextProvider>
              {children}
            </GameplayContextProvider>
          </CharacterContextProvider>
        </LevelContextProvider>
      </SettingsContextProvider>
    </DebugContextProvider>
  );
}
