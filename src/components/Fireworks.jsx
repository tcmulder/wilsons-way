import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

import BackgroundImage from '../images/pages/winner.svg?react';

import '../css/components/fireworks.css';

/** [rotate, x, pause (s) before next burst] — picked at random each cycle */
const trajectories = [
	['25deg', 400, 1.4],
	['18deg', 300, 0.3],
	['12deg', 200, 1.3],
	['7deg', 100, 0.1],
];

/**
 * Pick a random trajectory from the trajectories array.
 * @returns {Array} The random trajectory.
 */
function pickTrajectory() {
	return trajectories[Math.floor(Math.random() * trajectories.length)];
}

/**
 * Same preset as el1 but rotate and x flipped; gap unchanged.
 * @param {Array} trajectory The trajectory to negate.
 * @returns {Array} The negated trajectory.
 */
function negatedTrajectory([rotate, x, gap]) {
	return [`${-parseFloat(String(rotate))}deg`, -x, gap];
}

/**
 * Animated winner SVG fireworks layer (fills the page inner).
 */
export const Fireworks = () => {
	const backgroundSvgRef = useRef(null);

	// Rising fireworks: random trajectory each burst; fade always 0.3s from t=1.7; gap delays next burst
	useEffect(() => {
		const root = backgroundSvgRef.current;
		if (!root) return undefined;

		const el1 = root.querySelector('.sr-firework-1');
		const el2 = root.querySelector('.sr-firework-2');
		let cancelled = false;
		const pendingByEl = new Map();

		const burst = (el, mirror) => {
			if (cancelled) return;
			pendingByEl.get(el)?.kill();
			const picked = pickTrajectory();
			const [rotate, x, gap] = mirror ? negatedTrajectory(picked) : picked;
			const tl = gsap.timeline({
				onComplete: () => {
					if (cancelled) return;
					pendingByEl.set(el, gsap.delayedCall(gap, () => burst(el, mirror)));
				},
			});
			tl.fromTo(el, { y: -200, x: 0, scale: 0.6, opacity: 1 }, { y: -600, rotate, x, duration: 2, scale: 1, ease: 'power2.out' });
			tl.to(el, { opacity: 0, duration: 0.5, ease: 'power4.out' }, 1.7);
		};

		burst(el1, false);
		burst(el2, true);

		return () => {
			cancelled = true;
			pendingByEl.forEach((dc) => dc.kill());
			pendingByEl.clear();
			gsap.killTweensOf([el1, el2]);
		};
	}, []);

	return (
		<div className="sr-fireworks" aria-hidden="true">
			<BackgroundImage ref={backgroundSvgRef} className="sr-page-image" />
		</div>
	);
};
