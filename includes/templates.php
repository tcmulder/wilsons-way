<?php
/**
 * Page templates, shortcodes, and URL handling.
 *
 * All the means of displaying the game on the front-end.
 *
 * @package Shelf_Runner
 */

/**
 * Add game page template to WordPress template list.
 *
 * @param array $templates Existing page templates.
 * @return array Modified templates.
 */
function shelf_runner_add_page_template( $templates ) {
	$templates['templates/game-template.php'] = __( 'Game', 'shelf-runner' );
	return $templates;
}
add_filter( 'theme_page_templates', 'shelf_runner_add_page_template' );

/**
 * Load the game page template when selected.
 *
 * @param string $template Path to the template file.
 * @return string Template path.
 */
function shelf_runner_load_page_template( $template ) {
	if ( is_page_template( 'templates/game-template.php' ) ) {
		$template = SHELF_RUNNER_PLUGIN_DIR . 'templates/game-template.php';
	}
	return $template;
}
add_filter( 'template_include', 'shelf_runner_load_page_template' );

/**
 * Register a pretty permalink for the standalone game shell.
 *
 * Example: https://example.com/shelf-runner
 */
function shelf_runner_register_rewrite_rule() {
	add_rewrite_rule(
		'^shelf-runner/?$',
		'index.php?shelf_runner_game=1',
		'top'
	);
}
add_action( 'init', 'shelf_runner_register_rewrite_rule' );

/**
 * Redirect direct plugin URL to the pretty permalink.
 *
 * E.g. /wp-content/plugins/shelf-runner/ → /shelf-runner/
 */
function shelf_runner_redirect_direct_plugin_url() {
	$request_uri = isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '';
	if ( strpos( $request_uri, 'wp-content/plugins/shelf-runner' ) !== false ) {
		wp_safe_redirect( home_url( '/shelf-runner/' ), 301 );
		exit;
	}
}
add_action( 'init', 'shelf_runner_redirect_direct_plugin_url' );

/**
 * Register custom query var used for the game route.
 *
 * @param array $vars Public query vars.
 * @return array
 */
function shelf_runner_register_query_var( $vars ) {
	$vars[] = 'shelf_runner_game';
	return $vars;
}
add_filter( 'query_vars', 'shelf_runner_register_query_var' );

/**
 * When hitting the pretty game URL, render the plugin's standalone url.
 */
function shelf_runner_pretty_game_template_redirect() {
	if ( get_query_var( 'shelf_runner_game' ) ) {
		status_header( 200 );
		require SHELF_RUNNER_PLUGIN_DIR . 'index.php';
		exit;
	}
}
add_action( 'template_redirect', 'shelf_runner_pretty_game_template_redirect' );

/**
 * Send no-cache headers for the standalone game route.
 *
 * This discourages old versions of the game from loading after updates.
 */
function shelf_runner_send_nocache_headers_for_game() {
	if ( get_query_var( 'shelf_runner_game' ) ) {
		header( 'Cache-Control: no-store, no-cache, must-revalidate, max-age=0' );
		header( 'Pragma: no-cache' );
	}
}
add_action( 'send_headers', 'shelf_runner_send_nocache_headers_for_game' );

/**
 * Shortcode callback for [shelf-runner].
 * 
 * Examples: 
 * - [shelf-runner] // deaults to inline mode
 * - [shelf-runner type="inline"]
 * - [shelf-runner type="lightbox"]
 *
 * @param array  $atts    Shortcode attributes.
 * @param string $content Shortcode content (unused).
 * @return string Shortcode output.
 */
function shortcode_shelf_runner( $atts = array(), $content = null ) {
	ob_start();
	$parent_shortcode_call_uses_lightbox = isset( $atts['type'] ) && 'lightbox' === $atts['type'];
	include SHELF_RUNNER_PLUGIN_INC . '/shortcode.php';
	$content = ob_get_clean();
	return $content;
}
add_shortcode( 'shelf-runner', 'shortcode_shelf_runner' );

/**
 * Get URL for the game (e.g. for embedding in an iframe).
 *
 * @param array|null $query_params Optional query params (NOTE: currently only supports 'debug' boolean).
 * @return string The game URL.
 */
function shelf_runner_url( $query_params = null ) {
	$game_mode  = get_option( 'shelf_runner_settings_game_mode', 'client' );
	$url = 'client' === $game_mode ? get_option( 'shelf_runner_settings_iframe_url', '' ) : SHELF_RUNNER_PLUGIN_GAME_URI;
	if ( 'host' === $game_mode && is_array( $query_params ) && ( $query_params['debug'] ?? false ) ) {
		$debug_enabled = get_option( 'shelf_runner_settings_debug', false );
		if ( $debug_enabled ) {
			$url = add_query_arg( 'debug', 'true', $url );
		}
	}
	return $url;
}
