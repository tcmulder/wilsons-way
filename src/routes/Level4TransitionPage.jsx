import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTimedNavigation } from '../hooks/useTimedNavigation';
import SVGLevel1Transition from '../images/pages/level-1-transition.svg?react';

/**
 * Level 4 transition page (final level — next screen is high score).
 *
 * @returns {React.ReactNode} The Level4TransitionPage component.
 */
const Level4TransitionPage = () => {
	const { timedNavigate } = useTimedNavigation();
	const svgRef = useRef(null);
	const levelNumber = 4;

	// Auto-navigate to high score form (final level — no /level/5 route)
	useEffect(() => {
		timedNavigate({ route: '/form', delay: 3000 });
	}, [levelNumber, timedNavigate]);

	// Animate the transition
	useEffect(() => {
		const elDoor1 = svgRef.current?.querySelector('.sr-elevator-door-1');
		const elDoor2 = svgRef.current?.querySelector('.sr-elevator-door-2');
		const elDown = svgRef.current?.querySelector('.sr-elevator-down');
		if (!elDoor1 || !elDoor2) return;
		const tl = gsap.timeline();
		tl.fromTo(elDoor1, { x: '-90%' }, { x: '0%', duration: 2, ease: 'power2.inOut', delay: 1 })
			.fromTo(elDoor2, { x: '90%' },  { x: '0%', duration: 2, ease: 'power2.inOut' }, '<=')
			.fromTo(elDown,  { fill: '#99999B' }, { fill: '#00FE17', duration: 1, ease: 'power2.inOut' });
	}, []);

	return (
		<div>
			<SVGLevel1Transition className="sr-page-image" ref={svgRef} />
		</div>
	);
};

export default Level4TransitionPage;
