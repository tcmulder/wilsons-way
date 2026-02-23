<?php
/**
 * Plugin Name: Wilson's Way
 * Description: Adds the Shelf Runner game as an embed or template.
 * Version:     2.0.0
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
define( 'SHELF_RUNNER_VERSION', '2.0.0' );
define( 'SHELF_RUNNER_NAME', __( 'Wilson\'s Way', 'shelf-runner' ) );
define( 'SHELF_RUNNER_BASENAME', plugin_basename( __FILE__ ) );
define( 'SHELF_RUNNER_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'SHELF_RUNNER_PLUGIN_INC', SHELF_RUNNER_PLUGIN_DIR . 'includes/' );
define( 'SHELF_RUNNER_PLUGIN_URI', plugin_dir_url( __FILE__ ) );
define( 'SHELF_RUNNER_PLUGIN_DIST_URI', plugin_dir_url( __FILE__ ) . 'dist/' );
define( 'SHELF_RUNNER_ENV', str_contains( ( isset( $_SERVER['HTTP_HOST'] ) ? sanitize_text_field( wp_unslash( $_SERVER['HTTP_HOST'] ) ) : '' ), '5173' ) ? 'development' : 'production' );

// Gameplay constants.
define( 'SHELF_RUNNER_GAMEPLAY_SPEED', 250 );     // Base game speed (in pixels per second moved).
define( 'SHELF_RUNNER_CHARACTER_HEIGHT', 15 );    // Base character height (as percentage of game board height).
define( 'SHELF_RUNNER_JUMP_HEIGHT', 20 );         // Base jump height (as percentage of game board height).
define( 'SHELF_RUNNER_JUMP_HANGTIME', 1 );        // Base time in flight during jump (in seconds).

/**
 * Include admin functionality
 */
require_once SHELF_RUNNER_PLUGIN_INC . 'settings.php';
require_once SHELF_RUNNER_PLUGIN_INC . 'enqueue.php';
require_once SHELF_RUNNER_PLUGIN_INC . 'api.php';
require_once SHELF_RUNNER_PLUGIN_INC . 'templates.php';
require_once SHELF_RUNNER_PLUGIN_DIR . 'updates/update-checker.php';
