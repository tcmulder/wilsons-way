<?php
	/**
	 * Vite game implementation
	 */
if ( ! file_exists( '../../../wp-load.php' ) ) {
	die( 'WordPress not loaded' );
}
	require_once '../../../wp-load.php';
?><!doctype html>
<html lang="en">
	<head>
	<meta charset="UTF-8">
	<link rel="icon" type="image/svg+xml" href="<?php echo SHELF_RUNNER_PLUGIN_URI . 'public/game-icon-fav.svg'; ?>">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black">
	<meta name="apple-mobile-web-app-title" content="<?php echo SHELF_RUNNER_NAME; ?>">
	<link rel="apple-touch-icon" href="<?php echo SHELF_RUNNER_PLUGIN_URI . 'public/game-icon-apple.png'; ?>">
	<title><?php echo SHELF_RUNNER_NAME; ?></title>
	</head>
	<body>
	<?php
		// Get manifest values
		$manifest_url      = SHELF_RUNNER_PLUGIN_DIST_URI . 'manifest.json';
		$manifest_response = wp_remote_get( esc_url_raw( $manifest_url ) );
		$manifest          = ! is_wp_error( $manifest_response ) ? json_decode( wp_remote_retrieve_body( $manifest_response ), true ) : array();
	?>

	<!-- Prevent SVG loading flash with fade-in animation -->
	<style>#root{opacity:1;transition:opacity 0.3s 0.15s;@starting-style{opacity:0;}}</style>
	<div id="root">[game loading...]</div>
	
	<?php if ( 'development' === SHELF_RUNNER_ENV ) : ?>
		<script type="module" src="/src/main.jsx"></script>
	<?php else : ?>
		<script type="module" src="<?php echo SHELF_RUNNER_PLUGIN_DIST_URI . ( $manifest['src/main.jsx']['file'] ?? '<!-- undefined -->' ); ?>"></script>
		<link rel="stylesheet" href="<?php echo SHELF_RUNNER_PLUGIN_DIST_URI . ( $manifest['src/main.jsx']['css'][0] ?? 'undefined' ); ?>">
	<?php endif; ?>

	<?php
		// Provide JS access to various database values
		printf(
			'<script type="text/javascript">/* <![CDATA[ */var sr = %s;/* ]]> */</script>',
			json_encode(
				array(
					'url'   => esc_url( str_replace( 'http:', 'https:', SHELF_RUNNER_PLUGIN_URI ) ), // otherwise vite+safari forces http
					'api'   => esc_url_raw( rest_url() ),
					'nonce' => wp_create_nonce( 'wp_rest' ),
				)
			)
		);
		?>
	</body>
</html>
