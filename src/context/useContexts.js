import { createContext, useContext } from 'react';

/**
 * Creates and exports the React context objects
 * used to share state across the component tree.
 */
export const DebugContext = createContext();
export const SettingsContext = createContext();
export const LevelContext = createContext();
export const CharacterContext = createContext();
export const GameplayContext = createContext();
export const ScoreContext = createContext();

/**
 * Custom hooks that provide a convenient interface
 * for consuming each context in child components.
 */
export function useDebugContext() {
  return useContext(DebugContext);
}
export function useSettingsContext() {
  return useContext(SettingsContext);
}
export function useCharacterContext() {
  return useContext(CharacterContext);
}
export function useLevelContext() {
  return useContext(LevelContext);
}
export function useGameplayContext() {
  return useContext(GameplayContext);
}
export function useScoreContext() {
  return useContext(ScoreContext);
}
