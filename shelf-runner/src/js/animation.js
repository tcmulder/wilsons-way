import { state } from './state';

/**
 * Animate image sprites
 *
 *
 * This function takes an array of elements, and animates them by swapping between
 * their child elements. The elements should have a data attribute of "sprite" set
 * to the interval (in milliseconds) of the animation.
 *
 * @param {HTMLElement[]} els The elements to animate
 */
export const createAniSprite = (els) => {
	els?.forEach((el) => {
		if (el.classList.contains('is-animating')) {
			return;
		}
		el.classList.add('is-animating');
		const children = [...el.children];
		const interval = el.dataset.sprite;
		let i = 0;
		children.forEach((child) => (child.style.visibility = 'hidden'));
		el.nonStandardTimer = setInterval(() => {
			if (!el.isConnected) {
				return clearInterval(el.nonStandardTimer);
			}
			children[i].style.visibility = 'hidden';
			children[(i = (i + 1) % children.length)].style.visibility = 'visible';
		}, interval);
	});
};

/**
 * Move the scene behind the character
 *
 * This essentially is the movement of the game: when you "move forward" or "move
 * backward" you are really just scrubbing these animations.
 */
export const createAni = () => {
	const {
		elBoard,
		elStageProps,
		elProgressBars,
		gameplayDuration,
		timelines,
		level,
	} = state;
	timelines.board = elBoard.lastElementChild.animate(
		[
			{ transform: 'translateX(0px)' },
			{ transform: 'translateX(calc(-100% + 100cqw))' },
		],
		{
			duration: gameplayDuration,
			fill: 'forwards',
		},
	);
	elStageProps?.forEach((elBackground, i) => {
		const parallaxAmt = elBackground.dataset.parallax;
		if (!parallaxAmt) {
			return;
		}
		timelines[`background-${i}`] = elBackground.animate(
			[
				{ transform: 'translateX(0px)' },
				{ transform: `translateX(calc((${parallaxAmt}% + 100cqw) * -1))` },
			],
			{
				duration: gameplayDuration,
				fill: 'forwards',
			},
		);
		timelines[`background-${i}`].play();
	});
	timelines.progress = elProgressBars[level.current - 1].animate(
		[{ backgroundSize: '0% 100%' }, { backgroundSize: '100% 100%' }],
		{
			duration: gameplayDuration,
			fill: 'forwards',
		},
	);
	ani('pause');
};

/**
 * Handle animation movement types
 *
 * This lets you scrub forward, backward, or pause
 * on the board's animation.
 *
 * @param {string} type "pause", "play", or "backslide"
 */
export const ani = (type = 'pause') => {
	const { timelines } = state;
	// Loop through each timeline and set their playback to synchronize
	Object.values(timelines).forEach((timeline) => {
		if (type === 'pause') {
			timeline.playbackRate = 1;
			timeline.pause();
		} else if (type === 'play') {
			timeline.playbackRate = 1;
			timeline.play();
		} else if (type === 'backslide') {
			timeline.playbackRate = -1;
			timeline.play();
		}
	});
};
