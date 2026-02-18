import { useEffect } from 'react';
import { gsap } from 'gsap';
import {
	useGameplayContext,
	useCharacterContext,
	useLevelContext,
	useScoreContext,
} from '../context/useContexts';
import { useGameAudio } from '../hooks/useSFX';
import { trackMovement } from '../util/doMovement';

/**
 * Runs character movement logic on every GSAP tick.
 */
export function useMovementTicker() {
	const gameplayContext = useGameplayContext();
	const { setCharacterStatus, setCharacterModifiers, characterModifiers } = useCharacterContext();
	const { level } = useLevelContext();
	const { setScore } = useScoreContext();
	const { playSound } = useGameAudio();

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
	]);
}

