import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

import { Page } from '../components/Page';
import { useTimedNavigation } from '../hooks/useTimedNavigation';

import SVGLevel3Transition from '../images/pages/level-3-transition.svg?react';

/**
 * Level 3 transition page.
 *
 * @returns {React.ReactNode} The Level3TransitionPage component.
 */
const Level3TransitionPage = () => {
	const { timedNavigate } = useTimedNavigation();
	const svgRef = useRef(null);
	const levelNumber = 3;

	// Auto-navigate to next level
	useEffect(() => {
		timedNavigate({ route: `/level/${levelNumber + 1}/intro`, delay: 5000 });
	}, [ levelNumber, timedNavigate ]);

	// Animate the transition (viewBox height 810 → sun moves down by half)
	useEffect(() => {
		const elWilson = svgRef.current?.querySelector('.sr-wilson');
		const elSun = svgRef.current?.querySelector('.sr-sun');
		if (!elWilson) return;
		const tl = gsap.timeline({ delay: 1 });
		tl.to(
			elWilson,
			{ y: -900, x: 200, duration: 4, delay: 1, ease: 'power2.inOut' },
			0
		);
		if (elSun) {
			tl.to(
				elSun,
				{ y: '5%', duration: 5, ease: 'linear' },
				0
			);
		}
		return () => tl.kill();
	}, []);

	return (
		<Page fullWidth={true}>
			<SVGLevel3Transition className="sr-page-image" ref={svgRef} />
		</Page>
	);
};

export default Level3TransitionPage;
