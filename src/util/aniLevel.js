import { gsap } from 'gsap';

/**
 * Create animation timelines for level gameplay
 *
 * @param {Object} props The properties object
 * @param {HTMLElement} props.elBoard The board DOM element
 * @param {Function} props.setTimelines Function to set timelines in context
 * @param {number} props.gameplaySpeed The game speed setting
 */
export const aniLevel = (props) => {
	const { elBoard, setTimelines, gameplaySpeed } = props;
	if (!elBoard) return;
	
	// Kill all existing timelines
	setTimelines(prevTimelines => {
		prevTimelines.forEach(timeline => timeline.kill());
		return [];
	});
	
	// Find all direct descendant SVGs
	const svgElements = elBoard.querySelectorAll(':scope > svg');

	// Determine animation duration
	const svgWidth = parseInt(svgElements[0].getAttribute('viewBox').split(' ')[2]) / 2;
	let gameplayDuration = svgWidth / gameplaySpeed;
	
	// Create a separate timeline for each SVG
	const timelines = [];
	svgElements.forEach((svg) => {
		const speed = -1 * (parseInt(svg.dataset.parallax) || 100);
		const svgTimeline = gsap.timeline({ paused: true });
		svgTimeline
		.fromTo(
			svg,
			{ x: 0, xPercent: 0 },
			{
				xPercent: speed,
				x: '100cqw',
				ease: 'none',
				duration: gameplayDuration,
			},
			0,
		);
		timelines.push(svgTimeline);
	});

	// Store all timelines in context
	setTimelines(timelines);
};
