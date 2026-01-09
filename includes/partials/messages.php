<?php 
/**
 * Message overlay for levels and more.
 */
?>

<div class="sr-message-container">

    <?php
    /**
     * Level intro/outro messages
     */
    for ( $i = 1; $i <= SHELF_RUNNER_LEVELS; $i++ ) {
        $html = sr_wp_kses( apply_filters( 'the_content', get_option( 'shelf_runner_settings_level_' . $i . '_intro' ) ) );
        $controls = sprintf( '<button type="button" class="sr-button-yellow" data-message-resolve>%s</button>', __( 'Start Game', 'shelf-runner' ) );
        echo sr_message( 'level-' . $i . '-intro', $html, $controls );
        // We don't have an outro message or the final level (it goes to the loser/winner messages)
        if ( $i < SHELF_RUNNER_LEVELS ) {
            $html = sr_wp_kses( apply_filters( 'the_content', get_option( 'shelf_runner_settings_level_' . $i . '_outro' ) ) );
            $controls = sprintf( '<button type="button" class="sr-button-yellow" data-message-resolve>%s</button>', __( 'Next Level', 'shelf-runner' ) );
            echo sr_message( 'level-' . $i . '-outro', $html, $controls );
        }
    }
    ?>

    <?php
    /**
     * Loser message
     */
    $html = sr_wp_kses( apply_filters( 'the_content', get_option( 'shelf_runner_settings_loser' ) ) );
    $controls = sprintf( '<button type="button" class="sr-button-yellow" data-message-resolve>%s</button>', __( 'See Results', 'shelf-runner' ) );
    echo sr_message( 'loser', $html, $controls );
    ?>

    <?php
    /**
     * Winner message (contains form)
     */
    $html = sr_wp_kses( apply_filters( 'the_content', get_option( 'shelf_runner_settings_winner' ) ) );
    echo sr_message( 'winner', $html );
    ?>

    <?php
    /**
     * Leaderboard message
     */
    require_once( SHELF_RUNNER_PLUGIN_INC . 'partials/leaderboard.php' );
    ?>

<?php
    /**
     * Outro end-game message
     */
    require_once( SHELF_RUNNER_PLUGIN_INC . 'partials/outro.php' );
    ?>

</div>
