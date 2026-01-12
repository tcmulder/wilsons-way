import { useContext } from 'react';
import { GameContext } from './gameContext';

export function useGameContext() {
  return useContext(GameContext);
}
