import { useEffect } from 'react';
import { useGameplayContext } from '../context/useContexts';
import { useNavigate } from 'react-router-dom';

/**
 * Performs navigation during gameplay (e.g. you died or you completed a level)
 */
export function useSetupGameplayNavigation() {
	const { gameplayNavigation, setGameplayNavigation } = useGameplayContext();
	const navigate = useNavigate();
	useEffect(() => {
		if (gameplayNavigation) {
			setGameplayNavigation(null);
			navigate(gameplayNavigation);
		}
	}, [gameplayNavigation, setGameplayNavigation, navigate]);
}
