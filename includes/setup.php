<?php
/**
 * Plugin activation/deactivation.
 *
 * @package Shelf_Runner
 */

/**
 * Plugin activation callback.
 */
function shelf_runner_activate() {
	// Ensure the custom game URL rewrite rule is registered and flushed.
	if ( function_exists( 'shelf_runner_register_rewrite_rule' ) ) {
		shelf_runner_register_rewrite_rule();
	}
	flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'shelf_runner_activate' );

/**
 * Plugin deactivation callback.
 */
function shelf_runner_deactivate() {
	// Flush rewrite rules to remove the custom game URL.
	flush_rewrite_rules();
}
register_deactivation_hook( __FILE__, 'shelf_runner_deactivate' );
