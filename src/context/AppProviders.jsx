import { CharacterContextProvider } from './CharacterContext';
import { DebugContextProvider } from './DebugContext';
import { GameplayContextProvider } from './GameplayContext';
import { LevelContextProvider } from './LevelContext';
import { ScoreContextProvider } from './ScoreContext';
import { SettingsContextProvider } from './SettingsContext';

/**
 * Wraps app in all context providers.
 */
export function AppProviders({ children }) {
  return (
    <DebugContextProvider>
      <GameplayContextProvider>
        <SettingsContextProvider>
          <LevelContextProvider>
            <CharacterContextProvider>
              <ScoreContextProvider>
                {children}
              </ScoreContextProvider>
            </CharacterContextProvider>
          </LevelContextProvider>
        </SettingsContextProvider>
      </GameplayContextProvider>
    </DebugContextProvider>
  );
}
