<?php 
/**
 * First screen of the game.
 */

$allow_sfx = '1' === get_option( 'shelf_runner_settings_sfx' );
?>

<div class="sr-game-intro" data-message="intro">

	<div class="sr-game-intro-message">

		<h1 class="sr-logo"><?php _e( 'Shelf Runner', 'shelf-runner' ); ?></h1>

		<?php require_once( SHELF_RUNNER_PLUGIN_INC . 'partials/roster.php' ); ?>

		<div class="sr-game-intro-controls">

			<?php if ( $allow_sfx ) : ?>

				<label class="sr-toggle" aria-label="<?php _e( 'Toggle sound effects on or off', 'shelf-runner' ); ?>">
					<input type="checkbox" name="sfx">
					<span data-checked="<?php _e( 'On', 'shelf-runner' ); ?>" data-unchecked="<?php _e( 'Off', 'shelf-runner' ); ?>">
						<?php _e( 'SFX', 'shelf-runner' ); ?>
					</span>
					<i aria-hidden="true"></i>
				</label>

			<?php endif; ?>
			
			<button class="sr-button-yellow" data-message-resolve><?php _e( 'Start Game', 'shelf-runner' ); ?></button>
			
			<button class="sr-button-hollow sr-show-scores"><?php _e( 'View Scores', 'shelf-runner' ); ?></button>

			<?php if ( $allow_sfx ) : ?>
	
				<label class="sr-toggle" aria-label="<?php _e( 'Toggle music on or off', 'shelf-runner' ); ?>">
					<input type="checkbox" name="music">
					<span data-checked="<?php _e( 'On', 'shelf-runner' ); ?>" data-unchecked="<?php _e( 'Off', 'shelf-runner' ); ?>">
						<?php _e( 'Music', 'shelf-runner' ); ?>
					</span>
					<i aria-hidden="true"></i>
				</label>

			<?php endif; ?>

		</div>

	</div>

	<div class="sr-game-intro-clouds">
		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 1450 810">
			<g>
				<path fill="#FEFEFE" d="M115.5 319.2h18.7v3.2h9.4v3h6.2v3.2h3v3.2h6.3v3h3.2v3.2h3v3h6.4v-3h3V335h9.5v3.1h3v3H203v3.3h3.1v3h-6.3v3.2H78V341h6.2v-3h6.3v3h21.8v-3h-3v-3.2H96.7v-6.3h6.4v-3.1h3v-3h3.2v-3.3h6.2Z"/>
				<path fill="#FEE6AB" d="M115.5 319.2v-3h6.2V313h22v3.2h6.1v3h6.3v3.2h3v3h3.2v3.2h3v3.2h3.2v3h3.2v-3h9.3v-3.2h6.2v3.2h6.3v3h3.1v6.3h-9.4v-3h-3v-3.2h-9.4v3.1h-3v3h-6.4v-3h-3V335H159v-3H153v-3.3h-3v-3.2h-6.3v-3h-9.4v-3.2h-18.7ZM96.7 334.8h12.6v3.2h3v3H90.5v-3h3.1v-3.2h3Z"/>
			</g>
			<g>
				<path fill="#FEE6AB" d="M1236.3 161.2v-2.4h11.5v2.4h4.6v2.1h4.6v2.4h4.5v4.6h2.4v4.5h-2.4v-2.1h-4.5v-2.4h-2.3V168h-4.7v-2.3h-6.8v-2.4h-6.9v-2.1ZM1266.2 174.8v2.4h-2.3v-2.4h2.3ZM1151.3 135.8v-2.3h4.6v-2.2h2.2V129h29.9v2.3h11.5v2.2h2.3v2.3h4.7v2.4h2.2v2.3h4.6v2.2h2.4v2.3h2.3v2.3h2.2v2.4h2.3v2.3h2.3v4.5h2.4v2.3h2.1v2.4h2.4v2.1h2.3v4.7h2.3v2.3h2.2v2.4h2.3v2.2h2.4v2.3h2.3v2.3h-7v-2.3h-2.2v-2.3h-2.3v-2.2h-2.3v-2.4h-4.5V168h-2.4v-2.3h-2.3v-2.4h-4.5v-2.1h-2.3v-2.4h-2.4v-2.3h-2.3v-2.3h-2.3V152h-2.2v-2.3h-2.3v-2.4h-2.4V145h-4.5v-2.3h-4.7v-2.2h-4.6v-2.3h-6.9v-2.4h-13.8v-2.3h-9.2v2.3h-6.8Z"/>
				<path fill="#FEFEFE" d="M1151.3 135.8h6.8v-2.3h9.2v2.3h13.8v2.4h6.9v2.3h4.7v2.2h4.6v2.3h4.5v2.3h2.4v2.4h2.3v2.3h2.2v2.2h2.3v2.3h2.3v2.3h2.4v2.4h2.3v2.2h4.5v2.3h2.3v2.3h2.4v2.3h4.5v2.4h2.3v2.2h2.3v2.3h2.2v2.3h7v-2.3h-2.3v-2.3h-2.4v-2.2h-2.3v-2.4h-2.2V168h-2.3v-4.6h-2.3v-2.2h4.6v2.2h6.9v2.3h6.8v2.3h4.7v2.3h2.3v2.4h4.5v2.2h2.4v2.3h2.3v-2.3h-2.3v-2.2h2.3v2.2h2.3v2.3h4.5v2.3h4.7v4.5h-11.5v2.4h-204.5V184h-4.7v-2.2h2.3v-2.3h2.4v-2.3h4.5v-2.3h2.3v-2.2h2.3v-2.4h2.4V168h4.5v-2.3h2.3v-2.4h2.3v-2.1h2.4v-2.4h2.1v2.4h16.2v2.1h4.5v2.4h4.7v2.3h4.5v2.3h2.3v2.4h2.4v2.2h2.3v2.3h4.5v-2.3h-2.2v-4.6h-2.3V168h-2.3v-2.3h-2.4v-4.5h2.4v-2.3h2.3v-2.4h2.3v-2.3h2.2V152h2.3v-2.3h2.4v-2.4h2.3V145h2.2v-2.3h4.6v-2.2h2.4v-2.3h2.3v-2.4h4.5Z"/>
				<path fill="#FEE6AB" d="M1086.9 158.8v-2.3h20.6v2.3h4.7v2.4h6.9v4.5h2.3v2.3h2.3v2.3h2.4v4.5h2.1v2.4h-4.5v-2.4h-2.3v-2.1h-2.3v-2.4h-2.4V168h-4.5v-2.3h-4.6v-2.4h-4.5v-2.1h-16.2v-2.4Z"/>
			</g>
			<g>
				<path fill="#FEFEFE" d="M1315.5 50.2h18.7v3.2h9.4v3h6.2v3.2h3v3.2h6.3v3h3.2V69h3v3h6.4v-3h3V66h9.5V69h3v3h15.7v3.3h3.1v3h-6.3v3.2H1278V72h6.2v-3h6.3v3h21.8v-3h-3v-3.2h-12.6v-6.3h6.4v-3.1h3v-3h3.2v-3.3h6.2Z"/>
				<path fill="#FEE6AB" d="M1315.5 50.2v-3h6.2V44h22v3.2h6.1v3h6.3v3.2h3v3h3.2v3.2h3v3.2h3.2v3h3.2v-3h9.3v-3.2h6.2v3.2h6.3v3h3.1v6.3h-9.4v-3h-3v-3.2h-9.4V69h-3v3h-6.4v-3h-3V66h-3.3v-3h-6.2v-3.3h-3v-3.2h-6.3v-3h-9.4v-3.2h-18.7ZM1296.7 65.8h12.6V69h3v3h-21.8v-3h3.2v-3.2h3Z"/>
			</g>
			<g>
				<path fill="#FEE6AB" d="M299.7 124.5v-1.9h3.8v1.9h-3.8Z"/>
				<path fill="#FEFEFE" d="M253.7 117v1.8h1.8v1.9h11.2v2h3.6v1.8h3.6v1.8h2v1.8h3.6v1.8h1.8v2h1.8v1.8h2v1.9h1.7v3.6h1.8v2h3.7v1.8h2v1.8h1.7v3.8h1.8v1.9h1.8v1.8h16.6v-3.7h-5.4v-2h-2v-1.8H307V143h-1.8v-5.6h-3.6v-3.7h-2V132h-1.8v-3.8h3.8v-1.8h3.6v1.8h1.8v1.9h1.8v2h2v1.8h1.8v1.8h1.8v1.8h1.8v1.8h1.8v2h3.8v1.8h1.8v1.9h1.8v1.8h1.8v2h2v-2h1.7v2h1.9v1.8h1.8v1.8h3.7v1.8h3.6v-1.8h-3.6v-1.8h-1.8v-1.8h-3.7v-2h3.7v2h7.2v-2h7.4v2h22.2v1.8h11v1.8H399v5.6h-11.1v1.8h-16.5v1.9H353v1.8h-16.4v1.8H331v2h-9.1v1.8H92v-1.8h1.8v-2h1.8v-1.8h5.6v-1.9h3.6v-1.8h1.8V158h1.8v-2h3.8v-1.8h1.8v-1.8h5.6v-1.9h1.8v-1.8h3.6v-3.8h5.5V143h1.8v-1.8h3.8v-2h1.8v-1.8h1.8v-1.9h3.6v-1.8h2V132h3.6v-2h11v2h2v1.8h1.8v5.5h-1.8v9.4h1.8v3.7h5.4v1.8h9.2v1.8h7.3v-1.8h3.8v-1.8h-2v-1.9h-3.6v-1.8h-3.6v-2h-5.5v-1.8h-1.9v-3.6h3.7v-2h1.8v-1.8h3.7v-1.9h3.6v-1.8h1.9v1.8h5.5v1.9h1.8v1.8h5.6v2h1.8v1.8h1.8v1.8h3.8v1.8h16.5v-1.8h-3.7V143H217v-1.8h3.6v-2h1.8v-1.8h2v-3.7h1.7V132h1.9V128h3.7v-1.8h3.6v-1.9h3.6v-1.8h5.6v-2h3.6v-1.8h3.8V117h1.8Z"/>
				<path fill="#FEE6AB" d="M152.7 130V128h1.8v-1.8h11v1.8h1.8v1.8h1.8V143h3.8v1.8h1.8v1.8h5.5v2h3.6v1.8h3.7v1.9h2v1.8h-3.8v1.8h-7.4v-1.8H169v-1.8h-5.4v-3.7h-1.8v-9.4h1.8v-5.5h-1.8V132h-2v-2h-7.2ZM187.5 133.7V132h9.3v1.8h3.6v1.9h1.8v1.8h3.8v1.8h3.6v2h7.4v1.8h3.6v1.8h3.8v1.8h-16.6v-1.8H204V143h-1.8v-1.8h-1.8v-2h-5.6v-1.8H193v-1.9h-5.5v-1.8ZM336.5 148.6v1.8h1.8v1.9h3.6v1.8h-3.6v-1.8h-3.7v-1.9h-1.8v-1.8h3.7Z"/>
				<path fill="#FEE6AB" d="M261 117h9.3v1.8h5.5v1.9h1.9v2h3.6v1.8h3.7v1.8h9.2v-1.8H303.4v-1.9h1.8v1.9h1.8v1.8h3.8v1.8h1.8v1.8h1.8v2h1.8v1.8h1.8v1.9h2v1.8h1.8v1.8h1.8v2h3.6v1.8h2v1.8h1.7v1.9h5.6v2H331v-2h-1.8v2h-2v-2h-1.7v-1.9h-1.8V143h-1.8v-1.8H318v-2h-1.8v-1.8h-1.8v-1.8h-1.8v-1.9h-1.8V132h-2v-2H307v-1.8h-1.8v-1.8h-3.6v1.8h-3.8v3.8h1.8v1.8h2v3.7h3.6v5.6h1.8v1.8h1.8v1.8h2v2h5.4v3.7h-16.6v-1.9h-1.8v-1.8H296v-3.8h-1.8V143h-2v-1.8h-3.6v-2h-1.8v-3.7H285v-1.8h-2V132h-1.7v-2h-1.8v-1.8h-3.7v-1.8h-2v-1.8h-3.5v-1.9h-3.6v-2h-11.2v-1.8h-1.8V117h7.4Z"/>
			</g>
		</svg>
	</div>

</div>