import { useEffect } from 'react';
import { gsap } from 'gsap';

/**
 * Pause playback
 */
export const doPause = ({timelines, setStatus}) => {
	if (!timelines.length) return;
	timelines.forEach(timeline => timeline.pause());
	setStatus(prev => ({...prev, pause: 'pause'}));
}

/**
 * Play playback
 */
export const doPlay = ({timelines, setStatus}) => {
	if (!timelines.length) return;
	timelines.forEach(timeline => timeline.play());
	setStatus(prev => ({...prev, pause: 'none'}));
}

/**
 * Jump
 */
export const doJump = ({characterRef, status, setStatus, jump}) => {
	// Prevent double-jumps while already mid-air
	if (status?.jump !== 'none') return;
	if (!characterRef?.current) return;

	const el = characterRef.current;

	const tl = gsap.timeline();

	tl.to(el, {
		onStart: () => setStatus(prev => ({ ...prev, jump: 'up' })),
		y: `-${jump.height}em`,
		duration: jump.hangtime,
		ease: "power1.out",
	}).to(el, {
		onStart: () => setStatus(prev => ({ ...prev, jump: 'down' })),
		onComplete: () => setStatus(prev => ({ ...prev, jump: 'none' })),
		y: 0,
		duration: jump.hangtime,
		ease: "power1.in",
	});
}


/**
 * Jump hook
 * @param {Object} props The properties object
 * @param {Object} props.characterRef The character DOM element
 * @param {Object} props.status The status object
 * @param {Function} props.setStatus Function to set the status
 * @param {Object} props.jump The jump object (height in em units and hangtime in seconds)
 */
export function useCharacterMovement({ characterRef, status, setStatus, jump }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === ' ') {
        e.preventDefault();
        doJump({ characterRef, status, setStatus, jump });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, setStatus, characterRef, jump]);
}
