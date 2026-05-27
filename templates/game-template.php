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
	.sr-iframe-frame, {
		position: fixed;
		inset: 0;
	}
	.sr-iframe-frame iframe {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: 0;
	}
</style>
<div class="sr-iframe-frame">
	<iframe src="<?php echo esc_url( shelf_runner_url() ); ?>"></iframe>
</div>
