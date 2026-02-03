import { createContext, useContext } from 'react';

export const DebugContext = createContext();
export const SettingsContext = createContext();
export const LevelContext = createContext();
export const GameplayContext = createContext();

export function useDebugContext() {
  return useContext(DebugContext);
}

export function useSettingsContext() {
  return useContext(SettingsContext);
}

export function useLevelContext() {
  return useContext(LevelContext);
}

export function useGameplayContext() {
  return useContext(GameplayContext);
}
