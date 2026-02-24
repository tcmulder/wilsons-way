import { useEffect } from 'react';
import { useLevelContext } from '../context/useContexts';

export function useResetLevelComplete() {
	const { setIsLevelComplete } = useLevelContext();

	useEffect(() => {
		setIsLevelComplete(false);
	}, [setIsLevelComplete]);
}

