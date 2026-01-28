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
export const doPlay = ({timelines, setStatus, direction = 'forward'}) => {
	if (!timelines?.length) return;

	timelines.forEach(timeline => {
		if (!timeline) return;
		if (direction === 'backward') {
			timeline.reverse();
		} else {
			timeline.play();
		}
	});

	setStatus(prev => ({...prev, pause: 'none'}));
}

/**
 * Jump
 */
const doJump = ({characterRef, status, setStatus, jump}) => {
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
 * Run
 */
const doRun = ({direction, timelines, setStatus}) => {
	// Update movement direction in status
	setStatus(prev => ({ ...prev, move: direction }));

	// Control GSAP timelines based on direction (forward or backward)
	doPlay({ timelines, setStatus, direction });
}

/**
 * Movements hook
 * @param {Object} props The properties object
 * @param {Object} props.debug Whether debug mode is enabled
 * @param {Object} props.characterRef The character DOM element
 * @param {Object} props.status The status object
 * @param {Function} props.setStatus Function to set the status
 * @param {Object} props.jump The jump object (height in em units and hangtime in seconds)
 */
export function useCharacterMovement({ debug, characterRef, status, setStatus, jump, timelines }) {
  // Auto-play timelines when debug autoplay is not explicitly disabled (autoplay !== '0')
  useEffect(() => {
	if (debug?.autoplay !== '0') {
	  doPlay({ timelines, setStatus, direction: 'forward' });
	}
  }, [debug, timelines, setStatus]);

  useEffect(() => {
    const handleKeyDown = (e) => {
		// Ignore auto-repeat so logic only runs once per key press
		if (e.repeat) return;
		if (e.key === 'ArrowUp' || e.key === ' ') {
			e.preventDefault();
			doJump({ characterRef, status, setStatus, jump });
		}

		if (debug?.autoplay === '0') {
		  if (e.key === 'ArrowDown') {
			e.preventDefault();
			// Toggle play/pause on each ArrowDown press
			if (status.pause === 'pause') {
			  // Currently paused: play forward
			  doRun({ direction: 'forward', timelines, setStatus });
			} else {
			  // Currently playing: pause
			  doPause({ timelines, setStatus });
			}
		  }
		  if (e.key === 'ArrowRight') {
			e.preventDefault();
			doRun({ direction: 'forward', timelines, setStatus });
		  }
		  if (e.key === 'ArrowLeft') {
			e.preventDefault();
			doRun({ direction: 'backward', timelines, setStatus });
		  }
		}
	};

	const handleKeyUp = (e) => {
	  if (debug?.autoplay === '0') {
		if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
		  e.preventDefault();
		  doPause({ timelines, setStatus });
		}
	  }
	};

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
	  window.removeEventListener('keydown', handleKeyDown);
	  window.removeEventListener('keyup', handleKeyUp);
	};
  }, [debug, status, setStatus, characterRef, jump, timelines]);
}
