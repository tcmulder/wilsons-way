<?php
/**
 * Plugin settings
 */

/**
 * Create a "settings" link on the plugins page
 */
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'shelf_runner_action_links' );
function shelf_runner_action_links( $links ) {
    $links[] = '<a href="'. get_admin_url(  ) .'admin.php?page=shelf_runner">'.__( 'Settings', 'shelf-runner' ).'</a>';
    return $links;
}

/**
 * Add sidebar link
 */
add_action( 'admin_menu', 'shelf_runner_add_admin_menu' );
function shelf_runner_add_admin_menu(  ) {
    add_menu_page(
        __( 'Shelf Runner', 'shelf-runner' ),
        __( 'Shelf Runner', 'shelf-runner' ),
        'manage_options',
        'shelf_runner',
        'shelf_runner_options_page',
        'dashicons-games',
        50
    );
}

/**
 * Define options page form html
 */
function shelf_runner_options_page(  ) {
    echo '<form action="options.php" method="post">';
        printf( '<h1>%s</h1>', __( 'Shelf Runner', 'shelf-runner' ));
        settings_fields( 'shelf_runner_settings' );
        do_settings_sections( 'shelf_runner_settings' );
        submit_button();
    echo '</form>';
}

/**
 * Facilitate accordions
 */
function shelf_runner_accordion( $content, $summary = '' ) {
    $summary = $summary ? $summary : __( 'Edit Messaging', 'shelf-runner' );
    echo sprintf( '<details><summary>%s</summary>%s</details>', $summary, $content);
}

/**
 * Establish option page setting sections/fields
 */
add_action( 'admin_init', 'shelf_runner_settings_init' );
function shelf_runner_settings_init(  ) {

    // Repetitive WYSIWYG settings
    $wysiwyg_settings = array(
        'textarea_rows' => 7,
        'media_buttons' => false,
        'tinymce'       => array(
            'toolbar1'  => 'bold,italic,bullist,numlist,link',
            'toolbar2'  => '',
        ),
        'quicktags'     => false,
    );

    // Mode
    $mode = get_option( 'shelf_runner_settings_game_mode', 'client' );
    

    /**
     * Overall section heading
     */
    add_settings_section(
        'sr_section',
        __( 'Welcome to the Shelf Runner game settings', 'shelf-runner' ),
        function() {
            printf(
                '<p>%s:</p><ol><li>%s.</li><li>%s: <code>[shelf-runner type="inline"]</code>.</li><li>%s: <code>[shelf-runner type="lightbox"]</code>.</li></ol>',
                __( 'There are three ways to provide access to the game', 'shelf-runner' ),
                __( 'Apply the "Game" template to a page', 'shelf-runner' ),
                __( 'Add the following shortcode to play the game inline on a page', 'shelf-runner' ),
                __( 'Add the following shortcode to play the game in a lightbox, creating a hyperlink to #shelf-runner to open the lightbox', 'shelf-runner' )
            );
        },
        'shelf_runner_settings'
    );

    /**
     * Game Mode
     */
    add_option( 'shelf_runner_settings_game_mode', 'client' );
    register_setting( 'shelf_runner_settings', 'shelf_runner_settings_game_mode' );
    add_settings_field(
        'shelf_runner_settings_game_mode',
        __( 'Game Mode:', 'shelf-runner' ),
        function() {
            $game_mode = get_option( 'shelf_runner_settings_game_mode', 'client' );
            $client_html = sprintf(
                '<p><label><input type="radio" name="shelf_runner_settings_game_mode" value="client" %s /> %s</label></p>',
                checked( $game_mode, 'client', false ),
                __( 'Connect to a game hosted on a different server.', 'shelf-runner' )
            );
            $host_html = sprintf(
                '<p><label><input type="radio" name="shelf_runner_settings_game_mode" value="host" %s /> %s</label></p>',
                checked( $game_mode, 'host', false ),
                __( 'Host the game on this server.', 'shelf-runner' )
            );
            $disclaimer_html = sprintf( '<p><em>%s</em></p>', __( 'Note: you must save changes after making a new selection above for the relevant settings to appear.' , 'shelf-runner' ) );
            printf( '<fieldset>%s%s%s</fieldset>', $client_html, $host_html, $disclaimer_html );
        },
        'shelf_runner_settings',
        'sr_section'
    );

    /**
     * Client settings
     */
    if ( 'client' === $mode ) {
        
        /**
         * Iframe URL
         */
        add_option( 'shelf_runner_settings_iframe_url', '' );
        register_setting( 
            'shelf_runner_settings', 
            'shelf_runner_settings_iframe_url',
            array(
                'sanitize_callback' => 'esc_url_raw'
            )
        );
        add_settings_field(
            'shelf_runner_settings_iframe_url',
            __( 'Iframe URL:', 'shelf-runner' ),
            function() {
                printf(
                    '<input name="shelf_runner_settings_iframe_url" type="url" value="%s" class="regular-text" placeholder="https://" /><p><em>%s</em></p>',
                    esc_url( get_option( 'shelf_runner_settings_iframe_url', '' ) ),
                    __( 'Enter the game\'s URL.', 'shelf-runner' )
                );
            },
            'shelf_runner_settings',
            'sr_section'
        );

        /**
         * Exit Game button text
         */
        add_option( 'shelf_runner_settings_exit_game_text', __( '← Exit Game', 'shelf-runner' ) );
        register_setting( 'shelf_runner_settings', 'shelf_runner_settings_exit_game_text' );
        add_settings_field(
            'shelf_runner_settings_exit_game_text',
            __( 'Exit Game Link:', 'shelf-runner' ),
            function() {
                printf(
                    '<input name="shelf_runner_settings_exit_game_text" type="text" value="%s" class="regular-text" placeholder="%s" /><p><em>%s</em></p>',
                    esc_attr( get_option( 'shelf_runner_settings_exit_game_text', __( '← Exit Game', 'shelf-runner' ) ) ),
                    __( 'Button hidden (add text to reveal it)', 'shelf-runner' ),
                    __( 'Note: to hide the button, leave this field blank.', 'shelf-runner' )
                );
            },
            'shelf_runner_settings',
            'sr_section'
        );

    /**
     * Host settings
     */
    } elseif ( 'host' === $mode ) {


        /**
         * Level messages
         */
        for ( $i = 1; $i <= SHELF_RUNNER_LEVELS; $i++ ) {
            add_option( "shelf_runner_settings_level_{$i}_intro", __( "Level {$i} Intro", 'shelf-runner' ) );
            register_setting( 'shelf_runner_settings', "shelf_runner_settings_level_{$i}_intro" );
            if ( $i < SHELF_RUNNER_LEVELS ) {
                add_option( "shelf_runner_settings_level_{$i}_outro", __( "Level {$i} Outro", 'shelf-runner' ) );
                register_setting( 'shelf_runner_settings', "shelf_runner_settings_level_{$i}_outro" );
            }
            add_settings_field(
                "shelf_runner_settings_level_{$i}_intro",
                __( "Level {$i} Messages:", 'shelf-runner' ),
                function() use ( $i, $wysiwyg_settings ) {
                    ob_start();
                    printf( '<h2>%s</h2>', __( "Level {$i} Intro Message:", 'shelf-runner' ) );
                    wp_editor(
                        get_option("shelf_runner_settings_level_{$i}_intro"),
                        "shelf_runner_level_{$i}_intro",
                        array(
                            ...$wysiwyg_settings,
                            'textarea_name' => "shelf_runner_settings_level_{$i}_intro",
                        )
                    );
                    if ( $i < SHELF_RUNNER_LEVELS ) {
                        printf( '<h2>%s</h2>', __( "Level {$i} Outro Message:", 'shelf-runner' ) );
                        wp_editor(
                            get_option("shelf_runner_settings_level_{$i}_outro"),
                            "shelf_runner_level_{$i}_outro",
                            array(
                                ...$wysiwyg_settings,
                                'textarea_name' => "shelf_runner_settings_level_{$i}_outro",
                            )
                        );
                    }
                    $field = ob_get_clean();
                    shelf_runner_accordion( $field );
                },
                'shelf_runner_settings',
                'sr_section'
            );
        }

        /**
         * Loser message
         */
        add_option( 'shelf_runner_settings_loser', __( "You're not a loser, you tried... you're a failure", 'shelf-runner' ));
        register_setting( 'shelf_runner_settings', "shelf_runner_settings_loser" );
        add_settings_field(
            'shelf_runner_settings_loser',
            __( 'Loser message:', 'shelf-runner' ),
            function() use ( $wysiwyg_settings ) {
                ob_start();
                wp_editor(
                    get_option( 'shelf_runner_settings_loser' ),
                    'shelf_runner_settings_loser',
                    array(
                        ...$wysiwyg_settings,
                        'textarea_name' => 'shelf_runner_settings_loser',
                    )
                );
                $field = ob_get_clean();
                shelf_runner_accordion( $field );
            },
            'shelf_runner_settings',
            'sr_section'
        );

        /**
         * Winner message
         */
        add_option( 'shelf_runner_settings_winner', __( 'New high score!', 'shelf-runner' ));
        register_setting( 'shelf_runner_settings', "shelf_runner_settings_winner" );
        add_settings_field(
            'shelf_runner_settings_winner',
            __( 'Winner message:', 'shelf-runner' ),
            function() use ( $wysiwyg_settings ) {
                ob_start();
                wp_editor(
                    get_option( 'shelf_runner_settings_winner' ),
                    'shelf_runner_settings_winner',
                    array(
                        ...$wysiwyg_settings,
                        'textarea_name' => 'shelf_runner_settings_winner',
                    )
                );
                $field = ob_get_clean();
                shelf_runner_accordion( $field );
            },
            'shelf_runner_settings',
            'sr_section'
        );

        /**
         * End-game outro message (scrolling text)
         */
        add_option( 'shelf_runner_settings_outro', __( 'The end.', 'shelf-runner' ));
        register_setting( 'shelf_runner_settings', 'shelf_runner_settings_outro' );
        add_settings_field(
            'shelf_runner_settings_outro',
            __( 'Final message:', 'shelf-runner' ),
            function() use ( $wysiwyg_settings ) {
                ob_start();
                wp_editor(
                    get_option( 'shelf_runner_settings_outro' ),
                    'shelf_runner_settings_outro',
                    array(
                        ...$wysiwyg_settings,
                        'textarea_name' => 'shelf_runner_settings_outro',
                    )
                );
                $field = ob_get_clean();
                shelf_runner_accordion( $field );
            },
            'shelf_runner_settings',
            'sr_section'
        );

        /**
         * Leaderboard
         * 
         * Allows you to override the 10 most recent users/scores (in case someone
         * cheats or enters something untoward as their username, for instance).
         */
        add_option( 'shelf_runner_settings_leaderboard', array());
        register_setting( 
            'shelf_runner_settings', 
            'shelf_runner_settings_leaderboard',
            array(
                'sanitize_callback' => function( $leaderboard ) {
                    // filter out empty entries
                    $leaderboard = array_filter( $leaderboard, function( $entry ) {
                        return !empty( $entry['user'] );
                    } );
                    // ensure scores are integers
                    array_walk( $leaderboard, function( &$entry ) {
                        $entry['score'] = (int) $entry['score'];
                    } );
                    
                    // sort by score (highest first)
                    usort( $leaderboard, function( $a, $b ) {
                        return $b['score'] - $a['score'];
                    } );

                    return $leaderboard;
                }
            )
        );
        add_settings_field(
            'shelf_runner_settings_leaderboard',
            __( 'Leaderboard:', 'shelf-runner' ),
            function() {
                $html = sprintf(
                    '<p><em>%s<br>%s<br>%s</em></p>',
                    __( 'Leave username blank to remove an entry.', 'shelf-runner' ),
                    __( 'Scores will be automatically sorted highest to lowest on save.', 'shelf-runner' ),
                    __( 'Maximum of 6 characters, use underscores instead of spaces.', 'shelf-runner' )
                );
                $top_player_max = 10;
                $leaderboard = get_option( 'shelf_runner_settings_leaderboard', array() );
                for ( $i = 0; $i < $top_player_max; $i++ ) {
                    $user = isset( $leaderboard[ $i ]['user'] ) ? $leaderboard[ $i ]['user'] : '';
                    $score = isset( $leaderboard[$i][ 'score'] ) ? $leaderboard[ $i ]['score'] : 0;
                    $html .= sprintf(
                        '<div style="margin-block:5px;">
                            <label for="shelf_runner_settings_leaderboard[%d]_user" style="display:inline-block;width:80px;">#%d %s:</label>
                            <input type="text" 
                                id="shelf_runner_settings_leaderboard[%d]_user"
                                name="shelf_runner_settings_leaderboard[%d][user]" 
                                value="%s" 
                                placeholder="username"
                                pattern="[^\s]{1,6}"
                                maxlength="6"
                                style="width: 7em; margin-right: 0.5em;"
                            />
                            <input type="number" 
                                name="shelf_runner_settings_leaderboard[%d][score]" 
                                value="%d" 
                                min="0" 
                                step="1"
                                style="width: 6em;"
                            />
                        </div>',
                        $i,
                        $i + 1,
                        __( 'Player', 'shelf-runner' ),
                        $i,
                        $i,
                        strtoupper( esc_html( $user ) ),
                        $i,
                        (int) $score
                    );
                }
                echo $html;
            },
            'shelf_runner_settings',
            'sr_section'
        );

        /**
         * Collision difficulty
         */
        add_option( 'shelf_runner_settings_size', 100);
        register_setting( 'shelf_runner_settings', 'shelf_runner_settings_size' );
        add_settings_field(
            'shelf_runner_settings_size',
            __( 'Collision difficulty:', 'shelf-runner' ),
            function(  ) {
                printf(
                    '<input name="shelf_runner_settings_size" value="%s" type="number" step="1" min="1" max="200" required /><p><em>%s</em></p>',
                    get_option( 'shelf_runner_settings_size' ),
                    __( '100% is average. Lower values will make the game easier. (Note that the game was originally calibrated for 60% for jump clearances, etc.)', 'shelf-runner' )
                );
            },
            'shelf_runner_settings',
            'sr_section'
        );

        /**
         * Speed difficulty
         */
        add_option( 'shelf_runner_settings_speed', 100);
        register_setting( 'shelf_runner_settings', 'shelf_runner_settings_speed' );
        add_settings_field(
            'shelf_runner_settings_speed',
            __( 'Speed difficulty:', 'shelf-runner' ),
            function(  ) {
                printf(
                    '<input name="shelf_runner_settings_speed" value="%s" type="number" step="1" min="1" max="200" required /><p><em>%s</em></p>',
                    get_option( 'shelf_runner_settings_speed' ),
                    __( '100% is average. Lower values will make the game easier. (Note that the game was originally calibrated for 90% for jump trajectories, etc.)', 'shelf-runner' )
                );
            },
            'shelf_runner_settings',
            'sr_section'
        );

        /**
         * Milestone duration
         */
        add_option( 'shelf_runner_settings_milestone_duration', 3 );
        register_setting( 'shelf_runner_settings', 'shelf_runner_settings_milestone_duration' );
        add_settings_field(
            'shelf_runner_settings_milestone_duration',
            __( 'Milestone duration:', 'shelf-runner' ),
            function(  ) {
                printf(
                    '<input name="shelf_runner_settings_milestone_duration" value="%s" type="number" step="1" min="1" max="200" required /><p><em>%s</em></p>',
                    get_option( 'shelf_runner_settings_milestone_duration' ),
                    __( 'In seconds', 'shelf-runner' )
                );
            },
            'shelf_runner_settings',
            'sr_section'
        );

        /**
         * Enable/disable sound effects
         */
        add_option( 'shelf_runner_settings_sfx', true );
        register_setting( 'shelf_runner_settings', 'shelf_runner_settings_sfx' );
        add_settings_field(
            'shelf_runner_settings_sfx',
            __( 'Sounds:', 'shelf-runner' ),
            function() {
                $sfx_enabled = get_option( 'shelf_runner_settings_sfx', true );
                $html = sprintf(
                    '<input type="checkbox" id="shelf_runner_settings_sfx" name="shelf_runner_settings_sfx" value="1" %s />',
                    checked( $sfx_enabled, true, false )
                );
                $html .= sprintf( '<label for="shelf_runner_settings_sfx">%s</label>', __( 'Allow Music and Sound Effects', 'shelf-runner' ) );
                echo $html;
            },
            'shelf_runner_settings',
            'sr_section'
        );

    }

    /**
     * Enable/disable debug mode
     */
    add_option( 'shelf_runner_settings_debug', false );
    register_setting( 'shelf_runner_settings', 'shelf_runner_settings_debug' );
    add_settings_field(
        'shelf_runner_settings_debug',
        __( 'Debug Mode:', 'shelf-runner' ),
        function() {
            $debug_enabled = get_option( 'shelf_runner_settings_debug', false );
            $html = sprintf(
                '<input type="checkbox" id="shelf_runner_settings_debug" name="shelf_runner_settings_debug" value="1" %s />',
                checked( $debug_enabled, true, false )
            );
            $html .= sprintf( '<label for="shelf_runner_settings_debug">%s</label>', __( 'Enable debug mode', 'shelf-runner' ) );
            
            if ( $debug_enabled ) {

                $game_template_page = get_posts( array(
                    'post_type'      => 'page',
                    'posts_per_page' => 1,
                    'meta_key'       => '_wp_page_template',
                    'meta_value'     => 'templates/game-template.php',
                    'fields'         => 'ids'
                ) );
                if ( $game_template_page ) {
                    $debug_url = add_query_arg( 'debug', '1', get_permalink( $game_template_page[0] ) );
                    $html .= sprintf(
                        '<p><a href="%s" class="button button-secondary" target="_blank">%s <span style="transform:rotate(-45deg);display:inline-block;">→</span></a></p>',
                        esc_url( $debug_url ),
                        __( 'Open Debug URL', 'shelf-runner' )
                    );
                } else {
                    $html .= sprintf(
                        '<p>%s <code>?debug=1</code> %s</p>',
                        __( 'Add a query string to the end of your game page URL like ', 'shelf-runner' ),
                        __( 'to enable this feature.', 'shelf-runner' )
                    );
                }
                $html .= sprintf(
                    '<p><em>%s</em></p>',
                    __( 'Note: when enabled, scores will not be saved to the leaderboard.', 'shelf-runner' )
                );
            }
            
            echo $html;
        },
        'shelf_runner_settings',
        'sr_section'
    );

}