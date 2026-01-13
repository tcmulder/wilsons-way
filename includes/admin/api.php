<?php
/**
 * Rest API endpoints.
 */

/**
 * Create endpoint for updating user/score
 */
add_action( 'rest_api_init', function () {
    register_rest_route( 'shelf-runner/v1', '/winner/', array(
        'methods' => 'POST',
        'callback' => function ( $request ) {

            $params = json_decode($request->get_body(), true);
            $user = strtoupper( sanitize_title( $params['user'] ) );
            $score = (int) $params['score'];
            $is_debug = isset($params['enableDebug']) && $params['enableDebug'];
            $data = array(
                'user'=> $user,
                'score'=> $score,
            );

            if (!$is_debug) {
                $leaderboard = get_option( 'shelf_runner_settings_leaderboard', array() );
                $leaderboard = ! empty( $leaderboard ) ? $leaderboard : array();
                $leaderboard[] = array(
                    'user' => $user,
                    'score' => $score
                );
                usort( $leaderboard, function( $a, $b ) {
                    return $b['score'] - $a['score'];
                });
                $leaderboard = array_slice( $leaderboard, 0, SHELF_RUNNER_LEADERBOARD_COUNT );
                update_option( 'shelf_runner_settings_leaderboard', $leaderboard );
            } else {
                $data['debug'] = $is_debug;
            }

            $data['status'] = 200;

            return new WP_REST_Response( array( 'data' => $data ) );

        },
        'permission_callback' => '__return_true',
        'args' => array(
            'user' => array(
                'validate_callback' => function( $param, $request, $key ) {
                    return is_string( $param );
                }
            ),
            'score' => array(
                'validate_callback' => function( $param, $request, $key ) {
                    return is_numeric( $param );
                }
            )
        )
    ) );
} );

/**
 * Create a rest endpoint for retrieving the score leaderboard
 */
add_action( 'rest_api_init', function () {
    register_rest_route( 'shelf-runner/v1', '/leaderboard/', array(
        'methods' => 'GET',
        'callback' => function ( $request ) {
            $leaderboard = get_option( 'shelf_runner_settings_leaderboard', array() );
            $leaderboard = array_map( function ( $item ) {
                return array(
                    'user' => esc_html( $item['user'] ),
                    'score' => (int) $item['score']
                );
            }, $leaderboard );
            return new WP_REST_Response( array( 'data' => $leaderboard, 'status' => 200 ) );
        },
        'permission_callback' => '__return_true',
    ) );
} );

/**
 * Create a rest endpoint for retrieving game settings
 */
add_action( 'rest_api_init', function () {
    register_rest_route( 'shelf-runner/v1', '/settings/', array(
        'methods' => 'GET',
        'callback' => function ( $request ) {
            // Get crash difficulty percentage from settings
            $difficulty_crash = (int) get_option( 'shelf_runner_settings_size' );
            $difficulty_crash = $difficulty_crash ? ( $difficulty_crash / 100 ) : 1;
            $difficulty_speed = 100 - (int) get_option( 'shelf_runner_settings_speed' );
            
            // Build response data
            $data = array(
                'difficultyCrash' => $difficulty_crash,
                'difficultySpeed' => $difficulty_speed,
                'sfx'             => get_option( 'shelf_runner_settings_sfx' ) === "1",
                'debug'           => get_option( 'shelf_runner_settings_debug' ) === "1",
                'delayMilestone'  => ( (int) get_option( 'shelf_runner_settings_milestone_duration' ) ) * 1000,
                'scores'          => array_map( function( $score ) {
                    return array(
                        'user' => esc_html( $score['user'] ),
                        'score' => (int) $score['score']
                    );
                }, get_option( 'shelf_runner_settings_leaderboard' ) ?: array() ),
            );
            
            return new WP_REST_Response( array( 'data' => $data, 'status' => 200 ) );
        },
        'permission_callback' => '__return_true',
    ) );
} );