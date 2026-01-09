<?php
/**
 * Shortcode output for embedding the game within a WordPress page.
 */
$mode = get_option( 'campos_quest_settings_game_mode', 'client' );
$iframe_url = 'client' === $mode ? get_option( 'campos_quest_settings_iframe_url', '' ) : SHELF_RUNNER_PLUGIN_URI . 'includes/index.php';
if ( ! $iframe_url ) {
    printf( '<p>%s</p>', __( 'Error: please enter an iframe URL in the plugin settings.', 'shelf-runner' ) );
    return;
}
$debug_enabled = get_option( 'campos_quest_settings_debug', false );
if ( $debug_enabled ) {
    $iframe_url = add_query_arg( 'debug', '1', $iframe_url );
}
?>
<?php if ( $parent_shortcode_call_uses_lightbox ) : ?>
    <?php $exit_game_text = get_option( 'campos_quest_settings_exit_game_text', '' ); ?>
    <dialog class="sr-portal-lightbox">
        <iframe class="sr-portal-iframe" data-src="<?php echo esc_url( $iframe_url ); ?>"></iframe>
        <?php if ( $exit_game_text ) : ?>
            <form class="sr-portal-lightbox-close" method="dialog">
                <button autofocus>
                    <?php echo esc_html( $exit_game_text ); ?>
                </button>
            </form>
        <?php endif; ?>
    </dialog>
<?php else : ?>
    <div id="shelf-runner" class="sr-portal">
        <div class="sr-portal-overlay">
            <span role="heading" aria-level="2" class="sr-portal-label"><?php esc_html_e( 'Shelf Runner', 'shelf-runner' ); ?></span>
            <div class="sr-portal-button">
                <button aria-label="<?php _e( 'Play Shelf Runner', 'shelf-runner' ); ?>" role="button"><?php esc_html_e( 'Play Shelf Runner', 'shelf-runner' ); ?></button>
            </div>
        </div>
        <iframe class="sr-portal-iframe" data-src="<?php echo esc_url( $iframe_url ); ?>" title="<?php esc_html_e( 'Shelf Runner', 'shelf-runner' ); ?>"></iframe>
    </div>
<?php endif; ?>
