<?php
/**
 * Plugin Name: Wilson's Way
 * Description: Adds the Shelf Runner game as an embed or template.
 * Version:     2.4.0
 * Author:      Tomas Mulder
 * Author URI:  https://www.thinkaquamarine.com
 * License:     GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: shelf-runner
 *
 * @package Shelf_Runner
 */

/**
 * Exit if accessed directly
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Define constants
 */

// Plugin constants.
define( 'SHELF_RUNNER_VERSION', '2.4.0' );
define( 'SHELF_RUNNER_NAME', __( 'Wilson\'s Way', 'shelf-runner' ) );
define( 'SHELF_RUNNER_BASENAME', plugin_basename( __FILE__ ) );
define( 'SHELF_RUNNER_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'SHELF_RUNNER_PLUGIN_INC', SHELF_RUNNER_PLUGIN_DIR . 'includes/' );
define( 'SHELF_RUNNER_PLUGIN_URI', plugin_dir_url( __FILE__ ) );
define( 'SHELF_RUNNER_PLUGIN_DIST_URI', plugin_dir_url( __FILE__ ) . 'dist/' );
define( 'SHELF_RUNNER_PLUGIN_GAME_URI', home_url( '/shelf-runner/' ) );
define( 'SHELF_RUNNER_ENV', str_contains( ( isset( $_SERVER['HTTP_HOST'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_HOST'] ) ) : '' ), '5173' ) ? 'development' : 'production' );

// Gameplay constants.
define( 'SHELF_RUNNER_GAMEPLAY_SPEED', 240 );   // Base game speed (in pixels per second moved).
define( 'SHELF_RUNNER_CHARACTER_HEIGHT', 18 );  // Base character height (as percentage of game board height).
define( 'SHELF_RUNNER_JUMP_HEIGHT', 27 );       // Base jump height (as percentage of game board height).
define( 'SHELF_RUNNER_JUMP_HANGTIME', 0.7 );    // Base time in flight during jump (in seconds).
define( 'SHELF_RUNNER_LEADERBOARD_COUNT', 10 ); // Max number of entries kept on the leaderboard.
define(
	'SHELF_RUNNER_MESSAGES',
	array(
		'level_1_outro' => __( 'Level 1 outro', 'shelf-runner' ),
		'level_2_outro' => __( 'Level 2 outro', 'shelf-runner' ),
		'level_3_outro' => __( 'Level 3 outro', 'shelf-runner' ),
		'level_4_outro' => __( 'Level 4 outro', 'shelf-runner' ),
		'winner'        => __( 'Winner message', 'shelf-runner' ),
		'loser'         => __( 'Loser message', 'shelf-runner' ),
	)
);

/**
 * Include admin functionality
 */
require_once SHELF_RUNNER_PLUGIN_INC . 'setup.php';
require_once SHELF_RUNNER_PLUGIN_INC . 'settings.php';
require_once SHELF_RUNNER_PLUGIN_INC . 'enqueue.php';
require_once SHELF_RUNNER_PLUGIN_INC . 'api.php';
require_once SHELF_RUNNER_PLUGIN_INC . 'templates.php';
require_once SHELF_RUNNER_PLUGIN_DIR . 'updates/update-checker.php';
