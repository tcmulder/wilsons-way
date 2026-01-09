<?php
  /**
   * Vite game entry point
   * 
   * This file is the entry point for Vite during development. See includes/index.php for the production version.
   */
  if ( ! file_exists( '../../../wp-load.php' ) ) {
    die( 'WordPress not loaded' );
  }
  require_once '../../../wp-load.php';
?><!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/icon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Shelf Runner</title>
  </head>
  <body>
    <?php require_once( SHELF_RUNNER_PLUGIN_INC . 'game.php' ); ?>
    <script type="module" src="/src/js/index.js"></script>
    <script type="module" src="/src/js/shortcode.js"></script>
  </body>
</html>
