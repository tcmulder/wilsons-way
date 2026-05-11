import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { EightBitButton } from '../components/EightBit';
import { Page } from '../components/Page';
import { useTimedNavigation } from '../hooks/useTimedNavigation';

import SVGLevel1Transition from '../images/pages/level-2-transition.svg?react';

/**
 * Level 2 transition page.
 *
 * @returns {React.ReactNode} The Level2TransitionPage component.
 */
const Level2TransitionPage = () => {
	const navigate = useNavigate();
	const { timedNavigate } = useTimedNavigation();
	const svgRef = useRef(null);
	const levelNumber = 2;

	// Auto-navigate to next level
	useEffect(() => {
		timedNavigate({ route: `/level/${levelNumber + 1}/intro`, delay: 3000 });
	}, [ levelNumber, timedNavigate ]);

	// Animate the transition
	useEffect(() => {
		const elBike = svgRef.current?.querySelector('.sr-bike');
		if (!elBike) return;
		const tween = gsap.to(elBike, {
			x: 2000,
			duration: 3.5,
			ease: 'power2.in',
			delay: 1,
		});
		return () => tween.kill();
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

export default Level2TransitionPage;
