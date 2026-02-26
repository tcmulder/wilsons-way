<?php
	/**
	 * Shelf Runner game
	 *
	 * @package Shelf_Runner
	 */

// Load WordPress if not already loaded
if ( ! defined( 'ABSPATH' ) ) {
	$plugin_dir = dirname( __DIR__ );
	$candidates = array(
		$plugin_dir . '/../../wp-load.php',
		$plugin_dir . '/../../../wp-load.php',
	);
	$wp_load = '';
	foreach ( $candidates as $candidate ) {
		if ( file_exists( $candidate ) ) {
			$wp_load = $candidate;
			break;
		}
	}
	if ( '' === $wp_load ) {
		die( 'WordPress not loaded' );
	}
	require_once $wp_load;
}
?><!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<link rel="icon" type="image/svg+xml" href="<?php echo esc_url( SHELF_RUNNER_PLUGIN_URI . 'public/game-icon-fav.svg' ); ?>">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="apple-mobile-web-app-status-bar-style" content="black">
		<meta name="apple-mobile-web-app-title" content="<?php echo esc_attr( SHELF_RUNNER_NAME ); ?>">
		<link rel="apple-touch-icon" href="<?php echo esc_url( SHELF_RUNNER_PLUGIN_URI . 'public/game-icon-apple.png' ); ?>">
		<title><?php echo esc_html( SHELF_RUNNER_NAME ); ?></title>
	</head>
	<body>
	
	<!-- Prevent SVG loading flash with fade-in animation -->
	<style>#root{opacity:1;transition:opacity 0.3s 0.15s;@starting-style{opacity:0;}}</style>
	
	<div id="root">[game loading...]</div>
	
	<?php if ( 'development' === SHELF_RUNNER_ENV ) : ?>
		<?php // phpcs:ignore WordPress.WP.EnqueuedResources.NonEnqueuedScript -- Standalone HTML shell, not WP enqueue context. ?>
		<script type="module" src="/src/main.jsx"></script>
	<?php else : ?>
		<script type="module">
			// Load game client-side from manifest.json (with no caching on that file) to avoid stale plugin version issues.
			const distBase = <?php echo wp_json_encode( trailingslashit( SHELF_RUNNER_PLUGIN_DIST_URI ) ); ?>;
			const manifestUrl = distBase + 'manifest.json';
			const cacheBust = 'cb=' + Date.now();
			const toFreshUrl = (url) => (url.includes('?') ? (url + '&' + cacheBust) : (url + '?' + cacheBust));
			fetch(toFreshUrl(manifestUrl), {
					cache: 'no-store',
					headers: {
						'Cache-Control': 'no-cache, no-store, max-age=0',
						Pragma: 'no-cache'
					}
				})
					.then((response) => {
						if (!response.ok) {
							throw new Error('Failed to fetch manifest.json');
						}
						return response.json();
					})
					.then((manifest) => {
						const entry = manifest['src/main.jsx'] || {};

						if (Array.isArray(entry.css)) {
							entry.css.forEach((cssFile) => {
								const link = document.createElement('link');
								link.rel = 'stylesheet';
								link.href = toFreshUrl(distBase + cssFile);
								document.head.appendChild(link);
							});
						}

						if (!entry.file) {
							throw new Error('Missing src/main.jsx entry in manifest.json');
						}

						const script = document.createElement('script');
						script.type = 'module';
						script.src = toFreshUrl(distBase + entry.file);
						document.body.appendChild(script);
					})
					.catch((error) => {
						console.error('Shelf Runner asset load failed:', error);
					});
		</script>
	<?php endif; ?>

	<?php
		// Provide JS access to various database values.
		printf(
			'<script type="text/javascript">/* <![CDATA[ */var sr = %s;/* ]]> */</script>',
			wp_json_encode(
				array(
					'url'   => esc_url( str_replace( 'http:', 'https:', SHELF_RUNNER_PLUGIN_URI ) ), // Otherwise vite+safari forces http.
					'api'   => esc_url( str_replace( 'http:', 'https:', rest_url() ) ), // Otherwise vite+safari forces http.
					'nonce' => wp_create_nonce( 'wp_rest' ),
				)
			)
		);
		?>
	</body>
</html>
