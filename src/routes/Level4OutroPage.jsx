import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

import Flag from '../components/Flag';
import { Page } from '../components/Page';

import SVGFlag from '../images/pages/level-4-flag.svg?react';

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
			{ selector: '.sr-firework-1', xDir: -1 },
			{ selector: '.sr-firework-2', xDir: 1 },
			{ selector: '.sr-firework-3', xDir: -1 },
		]
			.map(({ selector, xDir }) => {
				return {
					el: pageRef.current?.querySelector(selector),
					x: `${xDir * 12}%`,
					y: `-${12}%`,
				};
			});

		for (const { el, x, y } of elFireworks) {
			if (!el) continue;
			gsap.set(el, { x: 0, y: 0, opacity: 0 });
			gsap
				.timeline()
				.to(el, { x, y, duration: 1.5, ease: 'power1.inOut', delay: 1 }, 0)
				.to(el, { opacity: 1, duration: 1, ease: 'power1.inOut' }, '<')
				.to(el, { opacity: 0, duration: 0.5, ease: 'power1.in' }, '<=1');
		}
	}, []);

	return (
		<Page fullWidth={true} ref={pageRef}>
			<Flag svg={SVGFlag} levelNumber={levelNumber} />
		</Page>
	);
};

export default Level4OutroPage;
