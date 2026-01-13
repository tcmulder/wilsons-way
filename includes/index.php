<?php
// Load WordPress if it's not already loaded (and fail if we can't load it)
if ( ! defined( 'ABSPATH' ) ) {
    if ( ! file_exists( '../../../../wp-load.php' ) ) {
        die( 'WordPress not loaded' );
    }
    require_once '../../../../wp-load.php';
}

// Determine client/host mode
$mode = get_option( 'shelf_runner_settings_game_mode', 'client' );

// Simply show iframe if in client mode
if ( 'client' === $mode ) {
    $iframe_url = get_option( 'shelf_runner_settings_iframe_url', '' );
    if ( $iframe_url ) {
        $style = 'border:0;position:absolute;inset:0;width:100%;height:100%;';
        $debug_enabled = get_option( 'shelf_runner_settings_debug', false );
        if ( $debug_enabled ) {
            $iframe_url = add_query_arg( 'debug', '1', $iframe_url );
        }
        printf( '<iframe src="%s" style="%s"></iframe>', esc_url( $iframe_url ), $style );
    } else {
        printf( '<p>%s</p>', __( 'Error: please enter an iframe URL in the plugin settings.', 'shelf-runner' ) );
    }
    return;    
}

// Get our file paths
$path_css = '';
$path_js = '';
$path_svg = '';
$url = SHELF_RUNNER_PLUGIN_DIST_URI . 'manifest.json';
$response = wp_remote_get( $url );
if ( ! is_wp_error( $response ) && 200 === wp_remote_retrieve_response_code( $response ) ) {
    $manifest = json_decode( wp_remote_retrieve_body( $response ), true );
    if ( isset( $manifest['src/js/index.js']['css'][0] ) ) {
        $path_css = SHELF_RUNNER_PLUGIN_DIST_URI . $manifest['src/js/index.js']['css'][0];
    }
    if ( isset( $manifest['src/js/index.js']['file'] ) ) {
        $path_js = SHELF_RUNNER_PLUGIN_DIST_URI . $manifest['src/js/index.js']['file'];
    }
}
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-title" content="<?php _e( 'Shelf Runner', 'shelf-runner' ); ?>">
    <link rel="apple-touch-icon" href="<?php echo SHELF_RUNNER_PLUGIN_DIST_URI . 'icon.png'; ?>">
    <title><?php _e( 'Shelf Runner', 'shelf-runner' ); ?></title>
    <link rel="stylesheet" href="<?php echo $path_css; ?>">
</head>
<body>
    <?php require_once( SHELF_RUNNER_PLUGIN_INC . 'game.php' ); ?>
    <script src="<?php echo $path_js; ?>"></script>
</body>
</html>