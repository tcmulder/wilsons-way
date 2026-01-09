<?php 
/**
 * Script/style enqueue
 */

/**
 * Enqueue the mini initialization script
 */
add_action( 'wp_enqueue_scripts', 'enqueue_shelf_runner' );
function enqueue_shelf_runner() {
    $url = SHELF_RUNNER_PLUGIN_URI . 'dist/manifest.json';
    $response = wp_remote_get( $url );
    if ( ! is_wp_error( $response ) && 200 === wp_remote_retrieve_response_code( $response )) {
        $manifest = json_decode( wp_remote_retrieve_body( $response ), true );
        if ( isset( $manifest['src/js/shortcode.js']['css'][0] ) ) {
            wp_enqueue_style( 'shelf-runner-style', SHELF_RUNNER_PLUGIN_URI . 'dist/' . $manifest['src/js/shortcode.js']['css'][0], array(), SHELF_RUNNER_VERSION, 'all' );
        }
        if ( isset( $manifest['src/js/shortcode.js']['file'] ) ) {
            wp_enqueue_script( 'shelf-runner-script', SHELF_RUNNER_PLUGIN_URI . 'dist/' . $manifest['src/js/shortcode.js']['file'], array(), SHELF_RUNNER_VERSION, true );
        }
    }
}