import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

import { Message } from '../components/Message';
import { Page } from '../components/Page';
import { Image } from '../components/Image';
import { WinnerForm } from '../components/WinnerForm';

import heading from '../images/text/you-won.svg?metadata';
import BackgroundImage from '../images/pages/winner.svg?react';

import '../css/pages/high-score-page.css';

/** [rotate, x, pause (s) before next burst] — picked at random each cycle */
const trajectories = [
	['25deg', 400, 1.4],
	['18deg', 300, 0.3],
	['12deg', 200, 1.3],
	['7deg', 100, 0.1],
];

function pickTrajectory() {
	return trajectories[Math.floor(Math.random() * trajectories.length)];
}

/** Same preset as el1 but rotate and x flipped; gap unchanged */
function negatedTrajectory([rotate, x, gap]) {
	return [`${-parseFloat(String(rotate))}deg`, -x, gap];
}

/**
 * Intro page
 */
const HighScorePage = () => {
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
		<Page className="sr-page--high-score">
			<div className="sr-page__request">
				<h1 className="sr-page__heading">
					<Image {...heading} alt="You Won!" />
				</h1>
				<Message messageKey="winner" />
				<WinnerForm />
			</div>
			<BackgroundImage ref={backgroundSvgRef} className="sr-page-image" />
		</Page>
	);
};

export default HighScorePage;