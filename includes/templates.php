<?php
/**
 * Page templates and shortcodes
 *
 * All the means of displaying the game on the front-end.
 */

/**
 * Add game page template to WordPress template list
 */
add_filter( 'theme_page_templates', 'shelf_runner_add_page_template' );
function shelf_runner_add_page_template( $templates ) {
	$templates['templates/game-template.php'] = __( 'Game', 'shelf-runner' );
	return $templates;
}

add_filter( 'template_include', 'shelf_runner_load_page_template' );
function shelf_runner_load_page_template( $template ) {
	if ( is_page_template( 'templates/game-template.php' ) ) {
		$template = SHELF_RUNNER_PLUGIN_DIR . 'templates/game-template.php';
	}
	return $template;
}

/**
 * Create the shortcode
 */
add_shortcode( 'shelf-runner', 'shortcode_shelf_runner' );
function shortcode_shelf_runner( $atts = [], $content = null ) {
	ob_start();
	$parent_shortcode_call_uses_lightbox = isset( $atts['type'] ) && 'lightbox' === $atts['type'];
	include SHELF_RUNNER_PLUGIN_INC . '/shortcode.php';
	$content = ob_get_clean();
	return $content;
}
