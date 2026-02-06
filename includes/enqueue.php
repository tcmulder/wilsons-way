<?php
/**
 * Script/style enqueue
 *
 * @package Shelf_Runner
 */

/**
 * Enqueue the mini initialization script and styles for the shortcode.
 */
function enqueue_shelf_runner() {
	$url      = SHELF_RUNNER_PLUGIN_DIST_URI . 'manifest.json';
	$response = wp_remote_get( $url );
	if ( ! is_wp_error( $response ) && 200 === wp_remote_retrieve_response_code( $response ) ) {
		$manifest   = json_decode( wp_remote_retrieve_body( $response ), true );
		$styles_url = $manifest['src/util/shortcode.js']['css'][0] ?? '';
		$script_url = $manifest['src/util/shortcode.js']['file'] ?? '';
		if ( $styles_url ) {
			wp_register_style( 'shelf-runner-style', SHELF_RUNNER_PLUGIN_DIST_URI . $styles_url, array(), SHELF_RUNNER_VERSION, 'all' );
		}
		if ( $script_url ) {
			wp_register_script( 'shelf-runner-script', SHELF_RUNNER_PLUGIN_DIST_URI . $script_url, array(), SHELF_RUNNER_VERSION, true );
		}
	}
}
add_action( 'wp_enqueue_scripts', 'enqueue_shelf_runner' );
