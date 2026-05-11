import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMusicTrack } from '../hooks/useMusicTrack';

import { EightBitButton } from '../components/EightBit';
import { Page } from '../components/Page';
import { useTimedNavigation } from '../hooks/useTimedNavigation';

import SVGLevel1Transition from '../images/pages/level-1-transition.svg?react';

/**
 * Level 1 transition page.
 * 
 * @returns {React.ReactNode} The Level1TransitionPage component.
 */
const Level1TransitionPage = () => {
	useMusicTrack('level-1');
	const navigate = useNavigate();
	const { timedNavigate } = useTimedNavigation();
	const svgRef = useRef(null);
	const levelNumber = 1;

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
		<Page fullWidth={true}>
			<SVGLevel1Transition className="sr-page-image" ref={svgRef} />
			<EightBitButton
				className="sr-8bit--br"
				label="Skip"
				onClick={() => navigate(`/level/${levelNumber + 1}/intro`)}
			/>
		</Page>
	);
};

export default Level1TransitionPage;