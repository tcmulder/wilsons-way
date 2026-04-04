import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Page } from '../components/Page';
import { useTimedNavigation } from '../hooks/useTimedNavigation';
import SVGLevel1Transition from '../images/pages/level-1-transition.svg?react';

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
		timedNavigate({ route: `/level/${levelNumber + 1}/intro`, delay: 3000 });
	}, [ levelNumber, timedNavigate ]);

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
		<Page>
			<SVGLevel1Transition className="sr-page-image" ref={svgRef} />
		</Page>
	);
};

export default Level3TransitionPage;
