import { useEffect } from 'react';
import { useMatch } from 'react-router-dom';
import { useLevelContext } from '../context/useContexts';

/**
 * Set the level when starting a level page's gameplay.
 *
 * @returns {void}
 */
export function useSetLevel() {
	const { setLevel } = useLevelContext();

	// Get the level from the route path (e.g. /level/1/ grabs 1)
	const match = useMatch('/level/:level');

	// Set the level when the component mounts
	useEffect(() => {
		const level = match?.params?.level ? parseInt(match.params.level, 10) : undefined;
		if (level != null && !Number.isNaN(level)) {
			setLevel(level);
		} else {
			setLevel(1);
		}
	}, [match?.params?.level, setLevel]);
}