import { gsap } from 'gsap';
import { useEffect } from 'react';

import {
	useGameplayContext,
	useCharacterContext,
	useLevelContext,
	useScoreContext,
	useSettingsContext,
	useDebugContext,
} from '../context/useContexts';
import { useGameAudio } from '../hooks/useSFX';
import { trackMovement } from '../util/doMovement';

/**
 * Subscribes to the GSAP ticker and runs trackMovement each frame (for collisions, elevation, gravity).
 */
export function useMovementTicker() {
	const gameplayContext = useGameplayContext();
	const { setGameplayNavigation } = gameplayContext;
	const { setCharacterStatus } = useCharacterContext();
	const { level } = useLevelContext();
	const { setScore, setTokens, lives, setLives } = useScoreContext();
	const { playSound } = useGameAudio();
	const { settings } = useSettingsContext();
	const { userAdjustedMilestone = 1 } = settings || {};
	const { debug } = useDebugContext();

	useEffect(() => {
		if (!gameplayContext) return;
		const tick = () => {
			const { elsRef, elevationRef, statusRef, jumpRef } = gameplayContext;
			trackMovement({
				// Used by trackMovement itself
				trackMovementArgs: {
					elsRef,
					statusRef,
				},
				// Passed through to checkCollisions function
				collisionsArgs: {
					elsRef,
					setScore,
					setTokens,
					level,
					playSound,
					userAdjustedMilestone,
					lives,
					setLives,
					setGameplayNavigation,
					debug,
				},
				// Passed through to checkElevation function
				elevationArgs: {
					elsRef,
					elevationRef,
				},
				// Passed through to doGravity function
				gravityArgs: {
					setCharacterStatus,
					statusRef,
					elevationRef,
					elsRef,
					jumpRef,
				},
			});
		};
		gsap.ticker.add(tick);
		return () => gsap.ticker.remove(tick);
	}, [
		gameplayContext,
		setCharacterStatus,
		setScore,
		setTokens,
		level,
		playSound,
		userAdjustedMilestone,
		lives,
		setLives,
		setGameplayNavigation,
		debug,
	]);
}

