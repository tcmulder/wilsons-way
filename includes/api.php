<?php
/**
 * Rest API endpoints.
 *
 * @package Shelf_Runner
 */

/**
 * Create endpoint for updating user/score.
 */
add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'shelf-runner/v1',
			'/winner/',
			array(
				'methods'             => 'POST',
				'callback'            => function ( $request ) {
					$params = json_decode( $request->get_body(), true );

					// Confirm we have what we need
					if ( ! is_array( $params ) || ! isset( $params['user'] ) || ! isset( $params['score'] ) ) {
						return new WP_REST_Response( array( 'data' => array( 'status' => 400, 'message' => 'Invalid request body' ) ), 400 );
					}

					// Debugging mode (doesn't save to database)
					$is_debug = $params['isDebugMode'] ?? false;
					// /*DEBUG*/$is_debug = false; // allows us to debug debug mode 😏

					$user = str_replace( '-', '_', strtoupper( sanitize_title( $params['user'] ) ) );
					$user = substr( $user, 0, 10 ); // trim to max characters (matches max on the winner form name input)
					$score = (int) $params['score'];
					$data = array(
						'user'  => $user,
						'score' => $score,
					);

					$leaderboard = get_option( 'shelf_runner_settings_leaderboard', array() );
					$leaderboard = ! empty( $leaderboard ) ? $leaderboard : array();
					$leaderboard[] = array(
						'user'  => $user,
						'score' => $score,
					);
					usort(
						$leaderboard,
						function ( $a, $b ) {
							return $b['score'] - $a['score'];
						}
					);
					$leaderboard = array_slice( $leaderboard, 0, SHELF_RUNNER_LEADERBOARD_COUNT );
					$leaderboard = array_pad( $leaderboard, SHELF_RUNNER_LEADERBOARD_COUNT, array( 'user' => '', 'score' => 0 ) );

					if ( ! $is_debug ) {
						update_option( 'shelf_runner_settings_leaderboard', $leaderboard );
					} else {
						$data['debug'] = $is_debug;
						$data['leaderboard'] = $leaderboard;
					}

					$data['status'] = 200;

					return new WP_REST_Response( array( 'data' => $data ) );
				},
				'permission_callback' => '__return_true',
				'args'                => array(
					'user'  => array(
						'validate_callback' => function ( $param ) {
							return is_string( $param );
						},
					),
					'score' => array(
						'validate_callback' => function ( $param ) {
							return is_numeric( $param );
						},
					),
				),
			)
		);
	}
);

/**
 * Create a rest endpoint for retrieving the score leaderboard
 */
add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'shelf-runner/v1',
			'/leaderboard/',
			array(
				'methods'             => 'GET',
				'callback'            => function () {
					$leaderboard = get_option( 'shelf_runner_settings_leaderboard', array() );
					$leaderboard = array_map(
						function ( $item ) {
							return array(
								'user'  => esc_html( $item['user'] ?? '' ),
								'score' => (int) ( $item['score'] ?? 0 ),
							);
						},
						$leaderboard
					);
					$leaderboard = array_pad( $leaderboard, SHELF_RUNNER_LEADERBOARD_COUNT, array( 'user' => '', 'score' => 0 ) );
					$response = new WP_REST_Response(
						array(
							'data'   => $leaderboard,
							'status' => 200,
						)
					);
					// Never cache: must reflect latest scores after POST /winner/.
					$response->header( 'Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0' );
					$response->header( 'Pragma', 'no-cache' );
					$response->header( 'Expires', 'Fri, 17 Feb 2017 12:00:00 GMT' );
					return $response;
				},
				'permission_callback' => '__return_true',
			)
		);
	}
);

/**
 * Create a rest endpoint for retrieving game settings
 */
add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'shelf-runner/v1',
			'/settings/',
			array(
				'methods'             => 'GET',
				'callback'            => function () {
					// Get crash difficulty percentage from settings.
					$difficulty_crash = (int) get_option( 'shelf_runner_settings_size' );
					$difficulty_crash = $difficulty_crash ? ( $difficulty_crash / 100 ) : 1;
					$difficulty_speed = ( 100 - (int) get_option( 'shelf_runner_settings_speed' ) ) / 50;
					$duration_milestone = (int) get_option( 'shelf_runner_settings_milestone_duration' );
					$duration_milestone = isset( $duration_milestone ) ? ( $duration_milestone / 50 ) : 1;
					$difficulty_lives = (int) get_option( 'shelf_runner_settings_lives' );

					// Build response data.
					$data = array(
						'gameplaySpeed'         => SHELF_RUNNER_GAMEPLAY_SPEED,
						'characterHeight'       => SHELF_RUNNER_CHARACTER_HEIGHT,
						'jumpHeight'            => SHELF_RUNNER_JUMP_HEIGHT / 100, // convert to percentage
						'jumpHangtime'          => SHELF_RUNNER_JUMP_HANGTIME,
						'userAdjustedCrash'     => $difficulty_crash,
						'userAdjustedSpeed'     => $difficulty_speed,
						'userAdjustedLives'     => $difficulty_lives,
						'userAdjustedMilestone' => $duration_milestone,
						'debugAllowed'          => get_option( 'shelf_runner_settings_debug' ) === '1',
						'version'               => SHELF_RUNNER_VERSION,
					);

					return new WP_REST_Response(
						array(
							'data'   => $data,
							'status' => 200,
						)
					);
				},
				'permission_callback' => '__return_true',
			)
		);
	}
);

/**
 * Message content endpoint (single key)
 *
 * Example: /wp-json/shelf-runner/v1/message/level_1_intro
 */
add_action(
	'rest_api_init',
	function () {
		register_rest_route(
			'shelf-runner/v1',
			'/message/(?P<key>[a-z0-9_]+)/',
			array(
				'methods'             => 'GET',
				'callback'            => function ( WP_REST_Request $request ) {
					$key = $request['key'];

					// Only allow keys that exist in the predefined messages list.
					$messages = shelf_runner_messages();
					if ( ! isset( $messages[ $key ] ) ) {
						return new WP_REST_Response(
							array(
								'data'   => null,
								'status' => 404,
							),
							404
						);
					}

					$value = get_option( "shelf_runner_settings_{$key}", '' );
					$value = is_string( $value ) ? $value : '';

					// Return text for textarea or HTML for the default wysiwyg editor.
					$type = $messages[ $key ];
					if ( 'textarea' === ( $type['type'] ?? '' ) ) {
						$value = sanitize_textarea_field( $value );
					} else {
						$value = wp_kses_post( apply_filters( 'the_content', $value ) );
					}

					return new WP_REST_Response(
						array(
							'data'   => array(
								'key'   => $key,
								'value' => $value,
							),
							'status' => 200,
						)
					);
				},
				'permission_callback' => '__return_true',
				'args'                => array(
					'key' => array(
						'validate_callback' => function ( $param ) {
							return is_string( $param ) && (bool) preg_match( '/^[a-z0-9_]+$/', $param );
						},
					),
				),
			)
		);
	}
);
