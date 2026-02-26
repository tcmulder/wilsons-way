import { useEffect } from 'react';
import { gsap } from 'gsap';
import {
	useGameplayContext,
	useCharacterContext,
	useLevelContext,
	useScoreContext,
	useSettingsContext,
} from '../context/useContexts';
import { useGameAudio } from '../hooks/useSFX';
import { trackMovement } from '../util/doMovement';

/**
 * Subscribes to the GSAP ticker and runs trackMovement each frame (for collisions, elevation, gravity).
 */
export function useMovementTicker() {
	const gameplayContext = useGameplayContext();
	const { setCharacterStatus, setCharacterModifiers, characterModifiers } = useCharacterContext();
	const { level } = useLevelContext();
	const { setScore } = useScoreContext();
	const { playSound } = useGameAudio();
	const { settings } = useSettingsContext();
	const { userAdjustedMilestone = 1 } = settings || {};

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
	]);
}

