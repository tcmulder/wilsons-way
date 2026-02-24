<?php
/**
 * Plugin settings.
 *
 * @package Shelf_Runner
 */

/**
 * Allow CORS for development environments.
 */
function shelf_runner_dev_mode() {
	if ( 'development' === SHELF_RUNNER_ENV ) {
		header( 'Access-Control-Allow-Origin: *' );
	}
}
add_action( 'init', 'shelf_runner_dev_mode' );

/**
 * Add Settings link on the plugins page.
 *
 * @param array $links Plugin action links.
 * @return array Modified links.
 */
function shelf_runner_action_links( $links ) {
	$url     = esc_url( get_admin_url( null, 'admin.php?page=shelf_runner' ) );
	$text    = esc_html( __( 'Settings', 'shelf-runner' ) );
	$links[] = '<a href="' . $url . '">' . $text . '</a>';
	return $links;
}
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'shelf_runner_action_links' );

/**
 * Add sidebar link.
 */
function shelf_runner_add_admin_menu() {
	add_menu_page(
		esc_html( __( 'Shelf Runner', 'shelf-runner' ) ),
		esc_html( __( 'Shelf Runner', 'shelf-runner' ) ),
		'manage_options',
		'shelf_runner',
		'shelf_runner_options_page',
		'dashicons-games',
		50
	);
}
add_action( 'admin_menu', 'shelf_runner_add_admin_menu' );

/**
 * Output the options page form.
 */
function shelf_runner_options_page() {
	echo '<form action="options.php" method="post">';
	printf( '<h1>%s</h1>', esc_html( __( 'Shelf Runner', 'shelf-runner' ) ) );
	settings_fields( 'shelf_runner_settings' );
	do_settings_sections( 'shelf_runner_settings' );
	submit_button();
	echo '</form>';
}

/**
 * Output an accordion (details/summary) for settings sections.
 *
 * @param string $content HTML content for the accordion body.
 * @param string $summary Optional. Summary label. Default from translation.
 */
function shelf_runner_accordion( $content, $summary = '' ) {
	$summary = $summary ? $summary : __( 'Edit Messaging', 'shelf-runner' );
	printf(
		'<details><summary>%s</summary>%s</details>',
		esc_html( $summary ),
		wp_kses_post( $content )
	);
}

/**
 * Establish option page setting sections/fields.
 */
function shelf_runner_settings_init() {
	// Shared WYSIWYG options for editor fields.
	$wysiwyg_settings = array(
		'textarea_rows' => 7,
		'media_buttons' => false,
		'tinymce'       => array(
			'toolbar1' => 'bold,italic,bullist,numlist,link',
			'toolbar2' => '',
		),
		'quicktags'     => false,
	);

	$mode = get_option( 'shelf_runner_settings_game_mode', 'client' );

	/**
	 * Overall section heading
	 */
	add_settings_section(
		'sr_section',
		esc_html( __( 'Welcome to the Shelf Runner game settings', 'shelf-runner' ) ),
		function () {
			printf(
				'<p>%s:</p><ol><li>%s.</li><li>%s: <code>[shelf-runner type="inline"]</code>.</li><li>%s: <code>[shelf-runner type="lightbox"]</code>.</li></ol>',
				esc_html( __( 'There are three ways to provide access to the game', 'shelf-runner' ) ),
				esc_html( __( 'Apply the "Game" template to a page', 'shelf-runner' ) ),
				esc_html( __( 'Add the following shortcode to play the game inline on a page', 'shelf-runner' ) ),
				esc_html( __( 'Add the following shortcode to play the game in a lightbox, creating a hyperlink to #shelf-runner to open the lightbox', 'shelf-runner' ) )
			);
		},
		'shelf_runner_settings'
	);

	add_option( 'shelf_runner_settings_game_mode', 'client' );
	register_setting( 'shelf_runner_settings', 'shelf_runner_settings_game_mode' );
	add_settings_field(
		'shelf_runner_settings_game_mode',
		esc_html( __( 'Game Mode:', 'shelf-runner' ) ),
		function () {
			$game_mode       = get_option( 'shelf_runner_settings_game_mode', 'client' );
			$client_html     = sprintf(
				'<p><label><input type="radio" name="shelf_runner_settings_game_mode" value="client" %s /> %s</label></p>',
				checked( $game_mode, 'client', false ),
				esc_html( __( 'Connect to a game hosted on a different server.', 'shelf-runner' ) )
			);
			$host_html       = sprintf(
				'<p><label><input type="radio" name="shelf_runner_settings_game_mode" value="host" %s /> %s</label></p>',
				checked( $game_mode, 'host', false ),
				esc_html( __( 'Host the game on this server.', 'shelf-runner' ) )
			);
			$disclaimer_html = sprintf(
				'<p><em>%s</em></p>',
				esc_html( __( 'Note: you must save changes after making a new selection above for the relevant settings to appear.', 'shelf-runner' ) )
			);
			if ( 'host' === $game_mode ) {
				$disclaimer_html = sprintf(
					'%s<p>%s: <br /><code>%s</code></p>',
					$disclaimer_html,
					esc_html( __( 'Use the iframe URL below to embed this hosted game on other websites', 'shelf-runner' ) ),
					esc_url( shelf_runner_url() )
				);
			}
			// Allow form elements; wp_kses_post() strips input/label.
			$allowed_fieldset = array(
				'p'     => array(),
				'label' => array(),
				'input' => array(
					'type'    => true,
					'name'    => true,
					'value'   => true,
					'checked' => true,
				),
				'em'    => array(),
				'br'    => array(),
				'code'  => array(),
			);
			printf(
				'<fieldset>%s%s%s</fieldset>',
				wp_kses( $client_html, $allowed_fieldset ),
				wp_kses( $host_html, $allowed_fieldset ),
				wp_kses( $disclaimer_html, $allowed_fieldset )
			);
		},
		'shelf_runner_settings',
		'sr_section'
	);

	if ( 'client' === $mode ) {

		add_option( 'shelf_runner_settings_iframe_url', '' );
		register_setting(
			'shelf_runner_settings',
			'shelf_runner_settings_iframe_url',
			array( 'sanitize_callback' => 'esc_url_raw' )
		);
		add_settings_field(
			'shelf_runner_settings_iframe_url',
			esc_html( __( 'Iframe URL:', 'shelf-runner' ) ),
			function () {
				printf(
					'<input name="shelf_runner_settings_iframe_url" type="url" value="%s" class="regular-text" placeholder="https://" /><p><em>%s</em></p>',
					esc_url( get_option( 'shelf_runner_settings_iframe_url', '' ) ),
					esc_html( __( 'Enter the game\'s URL.', 'shelf-runner' ) )
				);
			},
			'shelf_runner_settings',
			'sr_section'
		);

		add_option( 'shelf_runner_settings_exit_game_text', __( '← Exit Game', 'shelf-runner' ) );
		register_setting( 'shelf_runner_settings', 'shelf_runner_settings_exit_game_text' );
		add_settings_field(
			'shelf_runner_settings_exit_game_text',
			esc_html( __( 'Exit Game Link:', 'shelf-runner' ) ),
			function () {
				printf(
					'<input name="shelf_runner_settings_exit_game_text" type="text" value="%s" class="regular-text" placeholder="%s" /><p><em>%s</em></p>',
					esc_attr( get_option( 'shelf_runner_settings_exit_game_text', __( '← Exit Game', 'shelf-runner' ) ) ),
					esc_attr( __( 'Button hidden (add text to reveal it)', 'shelf-runner' ) ),
					esc_html( __( 'Note: to hide the button, leave this field blank.', 'shelf-runner' ) )
				);
			},
			'shelf_runner_settings',
			'sr_section'
		);

	} elseif ( 'host' === $mode ) {

		/* translators: %d: level number. */
		$level_intro_default = __( 'Level %d Intro', 'shelf-runner' );
		/* translators: %d: level number. */
		$level_outro_default = __( 'Level %d Outro', 'shelf-runner' );

		$number_of_levels = 4;

		for ( $i = 1; $i <= $number_of_levels; $i++ ) {
			add_option( "shelf_runner_settings_level_{$i}_intro", sprintf( $level_intro_default, $i ) );
			register_setting( 'shelf_runner_settings', "shelf_runner_settings_level_{$i}_intro" );
			if ( $i < $number_of_levels ) {
				add_option( "shelf_runner_settings_level_{$i}_outro", sprintf( $level_outro_default, $i ) );
				register_setting( 'shelf_runner_settings', "shelf_runner_settings_level_{$i}_outro" );
			}
			add_settings_field(
				"shelf_runner_settings_level_{$i}_intro",
				/* translators: %d: level number. */
				sprintf( __( 'Level %d Messages:', 'shelf-runner' ), $i ),
				function () use ( $i, $wysiwyg_settings ) {
					ob_start();
					/* translators: %d: level number. */
					printf( '<h2>%s</h2>', esc_html( sprintf( __( 'Level %d Intro Message:', 'shelf-runner' ), $i ) ) );
					wp_editor(
						get_option( "shelf_runner_settings_level_{$i}_intro" ),
						"shelf_runner_level_{$i}_intro",
						array_merge( $wysiwyg_settings, array( 'textarea_name' => "shelf_runner_settings_level_{$i}_intro" ) )
					);
					if ( $i < $number_of_levels ) {
						/* translators: %d: level number. */
						printf( '<h2>%s</h2>', esc_html( sprintf( __( 'Level %d Outro Message:', 'shelf-runner' ), $i ) ) );
						wp_editor(
							get_option( "shelf_runner_settings_level_{$i}_outro" ),
							"shelf_runner_level_{$i}_outro",
							array_merge( $wysiwyg_settings, array( 'textarea_name' => "shelf_runner_settings_level_{$i}_outro" ) )
						);
					}
					$field = ob_get_clean();
					shelf_runner_accordion( $field );
				},
				'shelf_runner_settings',
				'sr_section'
			);
		}

		add_option( 'shelf_runner_settings_loser', __( "You're not a loser, you tried... you're a failure", 'shelf-runner' ) );
		register_setting( 'shelf_runner_settings', 'shelf_runner_settings_loser' );
		add_settings_field(
			'shelf_runner_settings_loser',
			esc_html( __( 'Loser message:', 'shelf-runner' ) ),
			function () use ( $wysiwyg_settings ) {
				ob_start();
				wp_editor(
					get_option( 'shelf_runner_settings_loser' ),
					'shelf_runner_settings_loser',
					array_merge( $wysiwyg_settings, array( 'textarea_name' => 'shelf_runner_settings_loser' ) )
				);
				$field = ob_get_clean();
				shelf_runner_accordion( $field );
			},
			'shelf_runner_settings',
			'sr_section'
		);

		add_option( 'shelf_runner_settings_winner', __( 'New high score!', 'shelf-runner' ) );
		register_setting( 'shelf_runner_settings', 'shelf_runner_settings_winner' );
		add_settings_field(
			'shelf_runner_settings_winner',
			esc_html( __( 'Winner message:', 'shelf-runner' ) ),
			function () use ( $wysiwyg_settings ) {
				ob_start();
				wp_editor(
					get_option( 'shelf_runner_settings_winner' ),
					'shelf_runner_settings_winner',
					array_merge( $wysiwyg_settings, array( 'textarea_name' => 'shelf_runner_settings_winner' ) )
				);
				$field = ob_get_clean();
				shelf_runner_accordion( $field );
			},
			'shelf_runner_settings',
			'sr_section'
		);

		add_option( 'shelf_runner_settings_outro', __( 'The end.', 'shelf-runner' ) );
		register_setting( 'shelf_runner_settings', 'shelf_runner_settings_outro' );
		add_settings_field(
			'shelf_runner_settings_outro',
			esc_html( __( 'Final message:', 'shelf-runner' ) ),
			function () use ( $wysiwyg_settings ) {
				ob_start();
				wp_editor(
					get_option( 'shelf_runner_settings_outro' ),
					'shelf_runner_settings_outro',
					array_merge( $wysiwyg_settings, array( 'textarea_name' => 'shelf_runner_settings_outro' ) )
				);
				$field = ob_get_clean();
				shelf_runner_accordion( $field );
			},
			'shelf_runner_settings',
			'sr_section'
		);

		add_option( 'shelf_runner_settings_leaderboard', array() );
		register_setting(
			'shelf_runner_settings',
			'shelf_runner_settings_leaderboard',
			array(
				'sanitize_callback' => function ( $leaderboard ) {
					if ( ! is_array( $leaderboard ) ) {
						return array();
					}
					$leaderboard = array_filter(
						$leaderboard,
						function ( $entry ) {
							return ! empty( $entry['user'] );
						}
					);
					array_walk(
						$leaderboard,
						function ( &$entry ) {
							$entry['score'] = (int) $entry['score'];
						}
					);
					usort(
						$leaderboard,
						function ( $a, $b ) {
							return $b['score'] - $a['score'];
						}
					);
					return $leaderboard;
				},
			)
		);
		add_settings_field(
			'shelf_runner_settings_leaderboard',
			esc_html( __( 'Leaderboard:', 'shelf-runner' ) ),
			function () {
				$html        = sprintf(
					'<p><em>%s<br>%s<br>%s</em></p>',
					esc_html( __( 'Leave username blank to remove an entry.', 'shelf-runner' ) ),
					esc_html( __( 'Scores will be automatically sorted highest to lowest on save.', 'shelf-runner' ) ),
					esc_html( __( 'Maximum of 6 characters, use underscores instead of spaces.', 'shelf-runner' ) )
				);
				$leaderboard = get_option( 'shelf_runner_settings_leaderboard', array() );
				for ( $i = 0; $i < 10; $i++ ) {
					$user  = isset( $leaderboard[ $i ]['user'] ) ? $leaderboard[ $i ]['user'] : '';
					$score = isset( $leaderboard[ $i ]['score'] ) ? $leaderboard[ $i ]['score'] : 0;
					$html .= sprintf(
						'<div style="margin-block:5px;">
							<label for="shelf_runner_settings_leaderboard[%d]_user" style="display:inline-block;width:80px;">#%d %s:</label>
							<input type="text" id="shelf_runner_settings_leaderboard[%d]_user" name="shelf_runner_settings_leaderboard[%d][user]" value="%s" placeholder="username" pattern="[^\s]{1,6}" maxlength="6" style="width: 7em; margin-right: 0.5em;" />
							<input type="number" name="shelf_runner_settings_leaderboard[%d][score]" value="%d" min="0" step="1" style="width: 6em;" />
						</div>',
						$i,
						$i + 1,
						esc_html( __( 'Player', 'shelf-runner' ) ),
						$i,
						$i,
						esc_attr( strtoupper( $user ) ),
						$i,
						(int) $score
					);
				}
				echo wp_kses_post( $html );
			},
			'shelf_runner_settings',
			'sr_section'
		);

		add_option( 'shelf_runner_settings_size', 50 );
		register_setting( 'shelf_runner_settings', 'shelf_runner_settings_size' );
		add_settings_field(
			'shelf_runner_settings_size',
			esc_html( __( 'Collision difficulty:', 'shelf-runner' ) ),
			function () {
				printf(
					'<input name="shelf_runner_settings_size" value="%s" type="number" step="1" min="1" max="200" required /><p><em>%s</em></p>',
					esc_attr( (string) get_option( 'shelf_runner_settings_size' ) ),
					esc_html( __( '50% is average. Lower values will make the game easier. (Note that the game was originally calibrated for 50% for jump clearances, etc.)', 'shelf-runner' ) )
				);
			},
			'shelf_runner_settings',
			'sr_section'
		);

		add_option( 'shelf_runner_settings_speed', 50 );
		register_setting( 'shelf_runner_settings', 'shelf_runner_settings_speed' );
		add_settings_field(
			'shelf_runner_settings_speed',
			esc_html( __( 'Speed difficulty:', 'shelf-runner' ) ),
			function () {
				printf(
					'<input name="shelf_runner_settings_speed" value="%s" type="number" step="1" min="1" max="200" required /><p><em>%s</em></p>',
					esc_attr( (string) get_option( 'shelf_runner_settings_speed' ) ),
					esc_html( __( '50% is average. Lower values will make the game easier. (Note that the game was originally calibrated for 50% for jump trajectories, etc.)', 'shelf-runner' ) )
				);
			},
			'shelf_runner_settings',
			'sr_section'
		);

		add_option( 'shelf_runner_settings_debug', false );
		register_setting( 'shelf_runner_settings', 'shelf_runner_settings_debug' );
		add_settings_field(
			'shelf_runner_settings_debug',
			esc_html( __( 'Debug Mode:', 'shelf-runner' ) ),
			function () {
				$debug_enabled = get_option( 'shelf_runner_settings_debug', false );
				$html          = sprintf(
					'<input type="checkbox" id="shelf_runner_settings_debug" name="shelf_runner_settings_debug" value="1" %s />',
					checked( $debug_enabled, true, false )
				);
				$html         .= sprintf( '<label for="shelf_runner_settings_debug">%s</label>', esc_html( __( 'Enable debug mode', 'shelf-runner' ) ) );
	
				if ( $debug_enabled ) {
					$html     .= sprintf(
						'<p><a href="%s" class="button button-secondary" target="_blank">%s <span style="transform:rotate(-45deg);display:inline-block;">→</span></a></p>',
						esc_url( shelf_runner_url() . '?debug=true' ),
						esc_html( __( 'Open Debug URL', 'shelf-runner' ) )
					);
					$html .= sprintf(
						'<p><em>%s</em></p>',
						esc_html( __( 'Note: when enabled, scores will not be saved to the leaderboard.', 'shelf-runner' ) )
					);
				}
				// Allow checkbox, label, and debug UI; wp_kses_post() strips input/label.
				$allowed = array(
					'input' => array(
						'type'    => true,
						'name'    => true,
						'value'   => true,
						'id'      => true,
						'checked' => true,
					),
					'label' => array( 'for' => true ),
					'p'     => array(),
					'a'     => array(
						'href'   => true,
						'class'  => true,
						'target' => true,
					),
					'span'  => array( 'style' => true ),
					'code'  => array(),
					'em'    => array(),
				);
				echo wp_kses( $html, $allowed );
			},
			'shelf_runner_settings',
			'sr_section'
		);

	}

}
add_action( 'admin_init', 'shelf_runner_settings_init' );
