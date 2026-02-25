import { useEffect } from 'react';
import { useMatch } from 'react-router-dom';
import { useLevelContext } from '../context/useContexts';

/**
 * Set the level when starting a level page's gameplay.
 * Reads the level number from the route path (e.g. /level/1/ → 1).
 *
 * @returns {void}
 */
export function useSetLevel() {
	const { setLevel } = useLevelContext();
	const match = useMatch('/level/:level');

	useEffect(() => {
		const level = match?.params?.level ? parseInt(match.params.level, 10) : undefined;
		if (level != null && !Number.isNaN(level)) {
			setLevel(level);
		} else {
			setLevel(1);
		}
	}, [match?.params?.level, setLevel]);
}