<?php 
/**
 * Last screen of the game.
 */
?>

<div class="sr-game-outro" data-message="outro" data-message-has-autoscroll>
    <div class="sr-game-outro-frame sr-auto-scroller">
        
        <h1 class="sr-logo"><?php _e( 'Shelf Runner', 'shelf-runner' ); ?></h1>

        <div class="sr-game-outro-content">
            <?php echo cq_wp_kses( apply_filters( 'the_content', get_option( 'shelf_runner_settings_outro' ) ) ); ?>
        </div>

        <div class="sr-game-outro-footer">
            <p><?php _e( 'Our People Are Our Power', 'shelf-runner' ); ?></p>
            <button class="sr-button-yellow sr-restart"><?php _e( 'Play Again', 'shelf-runner' ); ?></button>
        </div>

    </div>
</div>