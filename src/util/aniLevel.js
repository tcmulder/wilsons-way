import { gsap } from 'gsap';

/**
 * Create animation timelines for level gameplay
 *
 * @param {Object} props The properties object
 * @param {HTMLElement} props.elBoard The board DOM element
 * @param {{ current: import('gsap').Timeline[] }} props.timelinesRef Ref holding current timelines
 * @param {Function} props.setTimelines Simple setter (value) => void to update timelines in context
 * @param {number} props.gameplaySpeed The game speed setting
 * @param {Function} [props.onComplete] Optional callback to run when the level animation finishes
 */
export const aniLevel = (props) => {
	const { elBoard, timelinesRef, setTimelines, gameplaySpeed, onComplete } = props;
	if (!elBoard) return;

	// Kill/clear all existing timelines
	const prevTimelines = timelinesRef?.current ?? [];
	prevTimelines.forEach(timeline => timeline.kill());
	setTimelines([]);

	// Find all direct descendant SVGs
	const svgElements = elBoard.querySelectorAll(':scope > svg');
	if (!svgElements.length) return;

	// Determine animation duration
	const svgWidth = parseInt(svgElements[0].getAttribute('viewBox').split(' ')[2]) / 2;
	const gameplayDuration = svgWidth / gameplaySpeed;
	if (gameplayDuration <= 0 || !Number.isFinite(gameplayDuration)) return;

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
				onComplete: () => {
					if (onComplete) {
						onComplete();
					}
				},
			},
			0,
		);
		timelines.push(svgTimeline);
	});

	// Store all timelines in context
	setTimelines(timelines);
};
