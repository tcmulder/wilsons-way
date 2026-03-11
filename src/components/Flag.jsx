import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';
import { useTimedNavigation } from '../hooks/useTimedNavigation';

/**
 * Flag rasing animation component
 * 
 * @param {Object} props The properties object
 * @param {React.ReactNode} props.svg The SVG to animate
 * @param {number} props.levelNumber The level number (not from state)
 * @returns {React.ReactNode} The Flag component
 */
const Flag = (props) => {
	const { svg:SVGFlag, levelNumber } = props;
	const svgRef = useRef(null);
	const { timedNavigate } = useTimedNavigation();

	// Auto-navigate to outro page
	useEffect(() => {
		timedNavigate({ route: `/level/${levelNumber}/outro`, delay: 3000 });
	}, [levelNumber, timedNavigate]);

	// Animate up the flag
	useEffect(() => {
		const elFlag = svgRef.current?.querySelector('.sr-flag');
		if (!elFlag) return;
		gsap.fromTo(elFlag, { y: '240%' }, { y: '0%', duration: 2, ease: 'power2.inOut', delay: 1});
	}, [levelNumber]);
	return <SVGFlag className="sr-page-image" ref={svgRef} />;
};

export default Flag;