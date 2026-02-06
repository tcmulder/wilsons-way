<?php
/**
 * Template Name: Game
 * Description: Full screen game template
 *
 * @package Shelf_Runner
 */

?>
<style>
	body,
	html {
		width: 100%;
		height: 100%;
		margin: 0;
		background-color: #000;
	}
	.sr-iframe-frame {
		position: fixed;
		inset: 0;
		display: grid;
		place-items: center;
	}
	.sr-iframe-frame iframe {
		border: 0;
		width: calc(100dvh * (16 / 9));
		max-width: 100%;
		aspect-ratio: 16 / 9;
		margin: 0 auto;
	}
</style>
<div class="sr-iframe-frame">
	<iframe src="<?php echo esc_url( SHELF_RUNNER_PLUGIN_URI ); ?>"></iframe>
</div>
