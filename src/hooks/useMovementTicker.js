import { useEffect } from 'react';
import { gsap } from 'gsap';
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
	const { setCharacterStatus, setCharacterModifiers, characterModifiers } = useCharacterContext();
	const { level } = useLevelContext();
	const { setScore, lives, setLives } = useScoreContext();
	const { playSound } = useGameAudio();
	const { settings } = useSettingsContext();
	const { userAdjustedMilestone = 1 } = settings || {};
	const { debug } = useDebugContext();

	useEffect(() => {
		if (!gameplayContext) return;
		const tick = () =>
			trackMovement({
				gameplayContext,
				setCharacterStatus,
				setScore,
				level,
				characterModifiers,
				playSound,
				setCharacterModifiers,
				userAdjustedMilestone,
				lives,
				setLives,
				setGameplayNavigation,
				debug,
			});
		gsap.ticker.add(tick);
		return () => gsap.ticker.remove(tick);
	}, [
		gameplayContext,
		setCharacterStatus,
		setScore,
		level,
		characterModifiers,
		playSound,
		setCharacterModifiers,
		userAdjustedMilestone,
		lives,
		setLives,
		setGameplayNavigation,
		debug,
	]);
}

