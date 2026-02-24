import { DebugContextProvider } from './DebugContext';
import { SettingsContextProvider } from './SettingsContext';
import { LevelContextProvider } from './LevelContext';
import { CharacterContextProvider } from './CharacterContext';
import { GameplayContextProvider } from './GameplayContext';
import { ScoreContextProvider } from './ScoreContext';

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
