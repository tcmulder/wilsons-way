import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useGameplayContext } from '../context/useContexts';

/**
 * Performs navigation during gameplay (e.g. you died or you completed a level)
 */
export function useSetupGameplayNavigation() {
	const { gameplayNavigation, setGameplayNavigation } = useGameplayContext();
	const navigate = useNavigate();
	useEffect(() => {
		if (gameplayNavigation !== null) {
			navigate(gameplayNavigation);
			setGameplayNavigation(null);
		}
	}, [gameplayNavigation, setGameplayNavigation, navigate]);
}
