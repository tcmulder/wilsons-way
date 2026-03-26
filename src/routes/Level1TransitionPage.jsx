import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTimedNavigation } from '../hooks/useTimedNavigation';
import SVGLevel1Transition from '../images/pages/level-1-transition.svg?react';

/**
 * Level 1 transition page.
 * 
 * @returns {React.ReactNode} The Level1TransitionPage component.
 */
const Level1TransitionPage = () => {
	const { timedNavigate } = useTimedNavigation();
	const svgRef = useRef(null);
	// TODO: const levelNumber = 1;
	const debugOnlyDidAlertOfRedirectToSettings = useRef(false);

	// Auto-navigate to next level
	useEffect(() => {
		if (debugOnlyDidAlertOfRedirectToSettings.current) return;
		setTimeout(() => {
			alert('Normally you would now advance to level 2, but for now you are being redirected to the initial page.');
			debugOnlyDidAlertOfRedirectToSettings.current = true;
		}, 2800);
		timedNavigate({ route: `/`, delay: 3000 });
		// TODO: timedNavigate({ route: `/level/${levelNumber + 1}`, delay: 3000 });
	}, [
		// TODO: levelNumber,
		timedNavigate
	]);

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

export default Level1TransitionPage;