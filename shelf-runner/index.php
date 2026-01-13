<?php
  /**
   * Vite game entry point
   * 
   * This file is the entry point for Vite during development. See includes/index.php for the production version.
   */
  if ( ! file_exists( '../../../../wp-load.php' ) ) {
    die( 'WordPress not loaded' );
  }
  require_once '../../../../wp-load.php';
?><!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/icon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Shelf Runner</title>
  </head>
  <body>
    <?php
      // Get crash difficulty percentage from settings
      $difficulty_crash = (int) get_option( 'shelf_runner_settings_size' );
      $difficulty_crash = $difficulty_crash ? ( $difficulty_crash / 100 ) : 1;
      $difficulty_speed = (int) get_option( 'shelf_runner_settings_speed' );
      $manifest_url = SHELF_RUNNER_PLUGIN_URI . 'shelf-runner/dist/manifest.json';

      // Get manifest values
      $manifest_response = wp_remote_get( esc_url_raw( $manifest_url ) );
      $manifest = ! is_wp_error( $manifest_response ) ? json_decode( wp_remote_retrieve_body( $manifest_response ), true ) : array();
    ?>

    <!-- Prevent SVG loading flash with fade-in animation -->
    <style>.sr-stage{opacity:1;transition:opacity0.3s 0.15s;@starting-style{opacity:0;}}</style>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
    <!-- <script type="module" src="<?php echo SHELF_RUNNER_PLUGIN_URI . 'shelf-runner/dist/' . $manifest['src/main.jsx']['file']; ?>"></script> -->

    <?php
        // Provide JS access to various database values
        printf(
            '<script type="text/javascript">/* <![CDATA[ */var sr = %s;/* ]]> */</script>',
            json_encode( array(
                'settings'      => array(
                    'difficultyCrash' => $difficulty_crash,
                    'difficultySpeed' => $difficulty_speed,
                    'sfx'             => get_option( 'shelf_runner_settings_sfx' ) === "1",
                    'debug'           => get_option( 'shelf_runner_settings_debug' ) === "1",
                    'delayMilestone'  => ( (int) get_option( 'shelf_runner_settings_milestone_duration' ) ) * 1000,
                ),
                'url'               => esc_url( str_replace('http:', 'https:', SHELF_RUNNER_PLUGIN_DIST_URI ) ), // otherwise vite+safari forces http
                'api'               => esc_url_raw( rest_url() ),
                'nonce'             => wp_create_nonce( 'wp_rest' ),
                'manifest'          => $manifest,
                'scores' => array_map( function( $score ) {
                    return [
                        'user' => esc_html( $score['user'] ),
                        'score' => (int) $score['score']
                    ];
                }, get_option( 'shelf_runner_settings_leaderboard' ) ?: [] ),
            ) )
        );
    ?>
    <!-- <script type="module" src="/src/js/index.js"></script>
    <script type="module" src="/src/js/shortcode.js"></script> -->
  </body>
</html>













<!-- <!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>shelf-runner</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html> -->
