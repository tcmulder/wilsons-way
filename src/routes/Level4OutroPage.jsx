import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

import Flag from '../components/Flag';
import { Page } from '../components/Page';

import SVGFlag from '../images/pages/level-4-flag.svg?react';

const FIREWORK_STAGGER_S = 0.25;

/**
 * Level 4 completion screen.
 *
 * @returns {React.ReactNode} The Level4OutroPage component.
 */
const Level4OutroPage = () => {
	const levelNumber = 4;
	const pageRef = useRef(null);

	useEffect(() => {
		const elFireworks = [
			{ selector: '.sr-firework-1', xDir: -1, delay: 1 },
			{ selector: '.sr-firework-2', xDir: 1, delay: 1.5 },
			{ selector: '.sr-firework-3', xDir: -1, delay: 2.5 },
		].map(({ selector, xDir, delay }) => ({
			el: pageRef.current?.querySelector(selector),
			x: `${xDir * 12}%`,
			y: `-${12}%`,
			delay,
		}));

		for (const { el, x, y, delay } of elFireworks) {
			if (!el) continue;
			gsap.set(el, { x: 0, y: 0, scale: 0.8, opacity: 0, transformOrigin: 'center bottom' });
			gsap
				.timeline({ delay })
				.to(el, { x, y, scale: 1, duration: 1.25, ease: 'power1.out' }, 0)
				.to(el, { opacity: 1, duration: 0.75, ease: 'power1.out' }, '<')
				.to(el, { opacity: 0, duration: 0.25, ease: 'power1.in' }, '<=1');
		}
	}, []);

	return (
		<Page fullWidth={true} ref={pageRef}>
			<Flag svg={SVGFlag} levelNumber={levelNumber} />
		</Page>
	);
};

export default Level4OutroPage;
