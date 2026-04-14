import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

import Flag from '../components/Flag';
import { Page } from '../components/Page';

import SVGFlag from '../images/pages/level-3-flag.svg?react';

/**
 * Level 3 completion screen.
 *
 * @returns {React.ReactNode} The Level3OutroPage component.
 */
const Level3OutroPage = () => {
	const levelNumber = 3;
	const pageRef = useRef(null);

	// Animate the jetpack.
	useEffect(() => {
		const elJetpack = pageRef.current?.querySelector('.sr-jetpack');
		if (!elJetpack) return;
		gsap.to(elJetpack, {
			y: '-15%',
			duration: 1,
			ease: 'power1.inOut',
			yoyo: true,
			repeat: -1,
		});
	}, []);

	return (
		<Page fullWidth={true} ref={pageRef}>
			<Flag svg={SVGFlag} levelNumber={levelNumber} />
		</Page>
	);
};

export default Level3OutroPage;
