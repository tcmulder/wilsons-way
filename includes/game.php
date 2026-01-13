<?php
// Get crash difficulty percentage from settings
$difficulty_crash = (int) get_option( 'shelf_runner_settings_size' );
$difficulty_crash = $difficulty_crash ? ( $difficulty_crash / 100 ) : 1;
$difficulty_speed = (int) get_option( 'shelf_runner_settings_speed' );
$manifest_url = SHELF_RUNNER_PLUGIN_DIST_URI . 'manifest.json';

// Get manifest values
$manifest_response = wp_remote_get( esc_url_raw( $manifest_url ) );
$manifest = ! is_wp_error( $manifest_response ) ? json_decode( wp_remote_retrieve_body( $manifest_response ), true ) : array();
?>

<iframe src="<?php echo esc_url( SHELF_RUNNER_PLUGIN_URI . 'shelf-runner/' ); ?>" style="border:0;width:100%;aspect-ratio:16/9;"></iframe>

<div class="sr">
    <div class="sr-stage">
        <!-- Prevent SVG loading flash with fade-in animation -->
        <style>.sr-stage { opacity: 1; transition: opacity 0.3s 0.15s; @starting-style { opacity: 0; } }</style>
        <?php
        // require_once( SHELF_RUNNER_PLUGIN_INC . 'partials/intro.php' );
        // require_once( SHELF_RUNNER_PLUGIN_INC . 'partials/board.php' );
        // require_once( SHELF_RUNNER_PLUGIN_INC . 'partials/progress.php' );
        // require_once( SHELF_RUNNER_PLUGIN_INC . 'partials/character.php' );
        // require_once( SHELF_RUNNER_PLUGIN_INC . 'partials/countdown.php' );
        // require_once( SHELF_RUNNER_PLUGIN_INC . 'partials/messages.php' );
        // require_once( SHELF_RUNNER_PLUGIN_INC . 'partials/score.php' );
        // require_once( SHELF_RUNNER_PLUGIN_INC . 'partials/controls.php' );
        // require_once( SHELF_RUNNER_PLUGIN_INC . 'partials/version.php' );
        ?>
    </div>
</div>

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
