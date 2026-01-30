import { DebugContextProvider } from './DebugContext';
import { SettingsContextProvider } from './SettingsContext';
import { StatusContextProvider } from './StatusContext';
import { LevelContextProvider } from './LevelContext';
import { CharacterContextProvider } from './CharacterContext';
import { TimelinesContextProvider } from './TimelinesContext';

export function AppProviders({ children }) {
  return (
    <DebugContextProvider>
      <SettingsContextProvider>
        <StatusContextProvider>
          <LevelContextProvider>
            <CharacterContextProvider>
              <TimelinesContextProvider>
                {children}
              </TimelinesContextProvider>
            </CharacterContextProvider>
          </LevelContextProvider>
        </StatusContextProvider>
      </SettingsContextProvider>
    </DebugContextProvider>
  );
}
