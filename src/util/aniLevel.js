import { gsap } from 'gsap';

/**
 * Create animation timelines for level gameplay
 *
 * @param {Object} props The properties object
 * @param {HTMLElement} props.elBoard The board DOM element
 * @param {{ current: import('gsap').Timeline[] }} props.timelinesRef Ref holding current timelines
 * @param {Function} props.setTimelines Simple setter (value) => void to update timelines in context
 * @param {number} props.gameplaySpeed The game speed setting
 * @param {Function} [props.setLevelProgress] Setter for level progress (0-100)
 * @param {Function} [props.onComplete] Optional callback to run when the level animation finishes
 */
export const aniLevel = (props) => {
	const { elBoard, timelinesRef, setTimelines, gameplaySpeed, setLevelProgress, onComplete } = props;
	if (!elBoard) return;

	// Kill/clear all existing timelines
	const prevTimelines = timelinesRef?.current ?? [];
	prevTimelines.forEach(timeline => timeline.kill());
	setTimelines([]);

	// Ensure progress starts at 0 for the next playback.
	setLevelProgress?.(0);

	// Find all direct descendant SVGs
	const svgElements = elBoard.querySelectorAll(':scope > svg');
	if (!svgElements.length) return;

	// Determine animation duration
	const svgWidth = parseInt(svgElements[0].getAttribute('viewBox').split(' ')[2]) / 2;
	const gameplayDuration = svgWidth / gameplaySpeed;
	if (gameplayDuration <= 0 || !Number.isFinite(gameplayDuration)) return;

	/**
	 * Update level progress based on the animation progress.
	 * @param {number} progress The animation progress (0-1)
	 */
	let lastPercent = -1;
	const handleUpdate = function () {
		// progress is 0..1 within the tween; map to 0..100
		const percent = Math.round(Math.min(1, Math.max(0, this.progress())) * 100);
		if (percent === lastPercent) return;
		lastPercent = percent;
		setLevelProgress?.(percent);
	};

	/**
	 * Complete the level animation and update the level progress to 100%.
	 */
	let didComplete = false;
	const handleComplete = function () {
		setLevelProgress?.(100);
		if (didComplete) return;
		didComplete = true;
		onComplete?.();
	};

	// Create a separate timeline for each SVG
	const timelines = [];
	svgElements.forEach((svg, index) => {
		const isFirst = index === 0;
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
				onUpdate: isFirst ? handleUpdate : undefined,
				onComplete: isFirst ? handleComplete : undefined,
			},
			0,
		);
		timelines.push(svgTimeline);
	});

	// Store all timelines in context
	setTimelines(timelines);
};
