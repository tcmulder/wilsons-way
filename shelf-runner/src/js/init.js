import { state, setCharacterState, setScoreState } from './state';
import { convertClassToData, getParam, getSvgWidth } from './utilities';
import { maybeEnableDebugMode } from './debug';
import { createAniSprite, createAni } from './animation';
import { bindControls as bindCharacterControls } from './bindings';
import { trackCollisions } from './collisions';
import { setLevel } from './level';
import { loadCharacter } from './characters';
import { setIntro, setMessageActions } from './messages';

import positiveSound from '../mp3/positive.mp3';
import negativeSound from '../mp3/negative.mp3';
import musicSound from '../mp3/music.mp3';

/**
 * Initialize game
 *
 * This runs just once the first time we load the game.
 *
 * @param {HTMLElement} el Element to initialize
 */
export const init = async (el) => {
	// Bail if we don't have a stage to work on
	if (!el) {
		return;
	}

	/**
	 * Get game values stored in WordPress's database
	 */
	state.wp = window.sr;

	console.log('🤞', window.sr)

	/**
	 * Establish speeds, heights, durations, etc.
	 */
	// The height of a jump (in cqmax units)
	state.jumpHeight = 11;
	// The default hangtime (in ms) for levels that have no override
	state.defaultHangtime = 300;
	// The game speed (in percentages)
	state.speed = {
		// The default if no overrides apply
		default: state.wp.settings.difficultySpeed,
		// The current game speed percentage (may change per level)
		percentage: 80,
		// The computed game speed ratio for use in actual animation calculations
		get computed() {
			return (200 - this.percentage) / 100;
		},
	};
	// Duration of time to consider the user inactive in ms
	state.delayInactive = 10000;
	// Countdown duration
	state.delayCountdown = 1000;
	// Duration of milestone messages in ms
	state.delayMilestone = state.wp.settings.delayMilestone;
	// Duration of invisibility bonus in ms
	state.delayInvisible = 5000;
	// Delay between typed characters for message animations in ms
	state.delayTyping = 2;
	// Speed of the auto-scrolling outro message
	state.delayOutroScroll = 30000;
	// A cancelable timer variable for use in various places
	state.timer = null;

	/**
	 * Store game level and scoring values
	 */
	// The current and total levels
	state.level = {
		current: 1,
		total: 4,
	};
	// The current score
	state.score = 0;
	// The user's username if they reach a high score
	state.user = '';
	// Set the crash area difficulty (set by the user via plugin settings)
	state.difficultyCrash = state.wp.settings.difficultyCrash;
	// Identify if we're at the end of the game
	state.isEnded = false;

	/**
	 * Setup the character
	 */
	// Identify character in use
	state.character = 1;
	// Establish character's state of movement
	state.status = {
		move: 'none',
		jump: 'none',
		pause: 'none',
	};

	/**
	 * Setup sounds
	 */
	state.sounds = {
		// Enable/disable all sounds (based on plugin settings)
		makeSound: state.wp.settings.sfx,
		// Disable sound effects (unless by user interaction later)
		makeSFX: false,
		// Disable music (unless by user interaction later)
		makeMusic: false,
		// Master volume multiplier (either 1 for on or 0 for off)
		volumeMaster: 1,
		// Volume level for sound effects
		volumeSFX: 0.8,
		// Volume level for music
		volumeMusic: 0.2,
		// Store music audio
		music: new Audio(musicSound),
		// Store sound effects
		sfx: {
			// Create sound effects capable of overlapping each other
			positive: () => new Audio(positiveSound),
			negative: () => new Audio(negativeSound),
		},
	};

	/**
	 * Enable/disable game features
	 */
	// Show messages
	state.enableMessages = true;
	// Enable autoplay/auto run
	state.enableAutoplay = true;
	// Enable debug mode
	state.enableDebug = false;

	/**
	 * Cache primary game board elements
	 */
	// The primary wrapper (which also provides scaling)
	state.elStage = el;
	// The container that will hose the board's SVG
	state.elBoard = state.elStage.querySelector('.sr-board');

	/**
	 * Cache character-related elements
	 */
	// The container that will house the character's SVG
	state.elCharacter = state.elStage.querySelector('.sr-character');
	// Within elCharacter the container that will house the animated score numbers
	state.elCharacterScore = state.elStage.querySelector('.sr-character-score');
	// Within elCharacter the area that collides with things (can be scaled smaller/bigger than the character)
	state.elCharacterCrashArea = state.elStage.querySelector(
		'.sr-character-crash',
	);
	// The character picker options
	state.elRosterCharacters = state.elStage.querySelectorAll(
		'.sr-roster-character',
	);
	// The message containers
	state.elMessages = state.elStage.querySelectorAll('[data-message]');

	/**
	 * Cache interface elements
	 */
	// Multiple control elements that restart the game at level 1 (keeping the same character)
	state.elControlRestarts = state.elStage.querySelectorAll('.sr-restart');
	// The toggle control for sound effects
	state.elControlToggleSFX = state.elStage.querySelector('[name=sfx]');
	// The toggle control for music
	state.elControlToggleMusic = state.elStage.querySelector('[name=music]');
	// The leaderboard display button for the intro screen
	state.elControlLeaderboard = state.elStage.querySelector('.sr-show-scores');

	// The container of the current user's score
	state.elScore = state.elStage.querySelector('.sr-score');
	// The countdown container as a level starts on autoplay
	state.elCountdown = state.elStage.querySelector('.sr-countdown');
	// The leaderboard container
	state.elLeaderboardScores = state.elStage.querySelectorAll(
		'.sr-leaderboard-score',
	);

	// Multiple game progress bar containers
	state.elProgressLevels = state.elStage.querySelectorAll('.sr-progress-level');
	// Multiple game progress bars
	state.elProgressBars = state.elStage.querySelectorAll('.sr-progress-bar');

	// Layers with non-obstacle items (things we don't collide with)
	state.elStageProps = [];

	/**
	 * Run methods to finish initialization
	 */
	// Enable or disable debugging
	maybeEnableDebugMode();

	// Pass some game settings to CSS
	state.elStage.style.setProperty(
		'--sr-milestone-delay',
		`${state.delayMilestone}ms`,
	);
	state.elStage.style.setProperty('--sr-h-jump', `${state.jumpHeight}cqw`);
	state.elStage.style.setProperty(
		'--sr-hangtime',
		`${state.defaultHangtime}ms`,
	);
	state.elStage.style.setProperty(
		'--sr-difficulty-crash',
		`${state.difficultyCrash}`,
	);

	// Animate any sprites we find (like the character)
	createAniSprite(state.elCharacter.querySelectorAll('[data-sprite]'));
	// Set initial score
	setScoreState(state.score, false);
	// // Bind controls for gameplay
	// bindCharacterControls();
	// // Run functions on activation of specific messages
	// setMessageActions();
	// // Show the intro message
	// await setIntro();
	// // Load the selected character's SVG
	// await loadCharacter(state.character);
	// // Prep HTML
	// convertClassToData(state.elCharacter);
	// Load the current level
	await setLevel(state.level.current);
};

/**
 * Setup or re-setup the game settings and elements
 *
 * This initially runs to set up the first level, then runs again
 * each time a new level is loaded to reinitialize anything new.
 */
export const setup = async () => {
	/**
	 * Prep HTML
	 */
	convertClassToData(state.elStage);

	/**
	 * Get elements for this setup() call
	 */
	// Elevated shelves we can jump on/off plus the ground floor
	state.elShelves = state.elStage
		.querySelector('.sr-shelves')
		.querySelectorAll(':scope > *');
	// All obstacles (good bad or neutral)
	state.elObstacles = [];
	// Add all obstacles that score on impact (good or bad)
	state.elStage
		.querySelectorAll('.sr-obstacles[data-score]')
		?.forEach((elObstacle) => {
			elObstacle.querySelectorAll(':scope > *').forEach((elChild) => {
				if (!elChild.hasAttribute('data-score')) {
					elChild.dataset.score = elObstacle.dataset.score;
				}
				state.elObstacles.push(elChild);
			});
		});
	// Add all milestone obstacles we can impact
	state.elStage
		.querySelectorAll('.sr-milestone-target')
		?.forEach((elMilestone) => {
			state.elObstacles.push(elMilestone);
		});
	// Create filtered list of all negative obstacles (those with a negative score)
	state.elObstaclesNegative = [...state.elObstacles].filter(
		(obstacle) =>
			obstacle.dataset.score && obstacle.dataset.score.startsWith('-'),
	);

	/**
	 * Initialize or reinitialize game settings that may have changed
	 */
	// Reestablish character's state of movement so the character is stopped
	state.status = {
		move: 'none',
		jump: 'none',
		pause: 'none',
	};
	// Reinitialize all animations so they start at the start
	state.timelines = {};
	// Possibly customize jump hangtime if the shelve's wrapper has a custom data-hangtime value
	if (!getParam('hangtime')) {
		state.hangtime =
			state.elShelves[0].parentElement.dataset.hangtime ||
			state.defaultHangtime;
	}
	// Possibly customize speed if the shelve's wrapper has a custom data-speed value
	if (!getParam('speed')) {
		state.speed.percentage =
			state.elShelves[0].parentElement.dataset.speed || state.speed.default;
	}
	// Calculate speed based on level's SVG width (so e.g. wider level SVGs don't play faster than short ones)
	state.gameplayDuration =
		state.speed.computed * getSvgWidth(state.elBoard.firstElementChild) * 2;
	// Prep to store items we've collided into already
	state.collided = new Set();

	/**
	 * Run methods to finish setup
	 */
	// Animate any new sprites
	createAniSprite(state.elStage.querySelectorAll('[data-sprite]'));
	// Track collisions to include any new obstacles
	trackCollisions();
	// Set the character state visually
	setCharacterState();
	// Establish the game board movement animations
	createAni();
	// Pass the jump hangtime value we've set to CSS for jump animations
	state.elStage.style.setProperty('--sr-hangtime', `${state.hangtime}ms`);
};
