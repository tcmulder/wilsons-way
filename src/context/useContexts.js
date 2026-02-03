import { createContext, useContext } from 'react';

export const DebugContext = createContext();
export const SettingsContext = createContext();
export const StatusContext = createContext();
export const LevelContext = createContext();
export const CharacterContext = createContext();
export const TimelinesContext = createContext();
export const SetTimelinesContext = createContext();
export const ElsContext = createContext();

export function useDebugContext() {
  return useContext(DebugContext);
}

export function useSettingsContext() {
  return useContext(SettingsContext);
}

export function useStatusContext() {
  return useContext(StatusContext);
}

export function useLevelContext() {
  return useContext(LevelContext);
}

export function useCharacterContext() {
  return useContext(CharacterContext);
}

export function useTimelinesContext() {
  return useContext(TimelinesContext);
}

export function useElsContext() {
  return useContext(ElsContext);
}

/** Use when you only need setTimelines. Stable value = no re-renders when timelines array updates. */
export function useSetTimelinesContext() {
  return useContext(SetTimelinesContext);
}
