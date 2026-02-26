<?php
/**
 * Shortcode output for embedding the game within a WordPress page.
 *
 * @package Shelf_Runner
 */

wp_enqueue_style( 'shelf-runner-style' );
wp_enqueue_script( 'shelf-runner-script' );

$iframe_url = shelf_runner_url( array( 'debug' => true ) );
if ( ! $iframe_url ) {
	printf( '<p>%s</p>', esc_html( __( 'Error: please enter an iframe URL in the plugin settings.', 'shelf-runner' ) ) );
	return;
}
?>
<?php if ( $parent_shortcode_call_uses_lightbox ) : ?>
	<?php $exit_game_text = get_option( 'shelf_runner_settings_exit_game_text', '' ); ?>
	<div id="shelf-runner">
		<dialog class="sr-portal-lightbox">
			<iframe class="sr-portal-iframe" style="border:0;width:100%;aspect-ratio:16/9;" data-src="<?php echo esc_url( $iframe_url ); ?>"></iframe>
			<?php if ( $exit_game_text ) : ?>
				<form class="sr-portal-lightbox-close" method="dialog">
					<button autofocus>
						<?php echo esc_html( $exit_game_text ); ?>
					</button>
				</form>
			<?php endif; ?>
		</dialog>
	</div>
<?php else : ?>
	<div id="shelf-runner" class="sr-portal">
		<div class="sr-portal-overlay">
			<span role="heading" aria-level="2" class="sr-portal-label"><?php esc_html_e( 'Shelf Runner', 'shelf-runner' ); ?></span>
			<div class="sr-portal-button">
				<button aria-label="<?php echo esc_attr( __( 'Play Shelf Runner', 'shelf-runner' ) ); ?>" role="button"><?php esc_html_e( 'Play Shelf Runner', 'shelf-runner' ); ?></button>
			</div>
		</div>
		<iframe class="sr-portal-iframe" data-src="<?php echo esc_url( $iframe_url ); ?>" title="<?php echo esc_attr( __( 'Shelf Runner', 'shelf-runner' ) ); ?>"></iframe>
	</div>
<?php endif; ?>
