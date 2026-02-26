<?php
/**
 * Update Checker
 *
 * This script facilitates plugin updates. It is inspired heavily by
 * Misha Rudrastyh's excellent tutorial.
 *
 * @see https://rudrastyh.com/wordpress/self-hosted-plugin-update.html
 *
 * @package Shelf_Runner
 */

defined( 'ABSPATH' ) || exit;

if ( ! class_exists( 'ShelfRunnerUpdateChecker' ) ) {

	/**
	 * Self-hosted plugin update checker.
	 */
	class ShelfRunnerUpdateChecker {

		/**
		 * Plugin basename.

		 * @var string
		 */
		public $plugin_slug;

		/**
		 * Plugin version.

		 * @var string
		 */
		public $version;

		/**
		 * Transient cache key.

		 * @var string
		 */
		public $cache_key;

		/**
		 * Whether caching is allowed.

		 * @var bool
		 */
		public $cache_allowed;

		/**
		 * URL to the remote update info JSON.
		 *
		 * @var string
		 */
		public $updater_json;

		/**
		 * Constructor.
		 */
		public function __construct() {

			$this->plugin_slug   = SHELF_RUNNER_BASENAME;
			$this->version       = SHELF_RUNNER_VERSION;
			$this->cache_key     = 'shelf_runner_custom_upd';
			$this->cache_allowed = true;
			$this->updater_json  = 'https://raw.githubusercontent.com/tcmulder/wilsons-way/master/updates/info.json';

			add_filter( 'plugins_api', array( $this, 'info' ), 20, 3 );
			add_filter( 'site_transient_update_plugins', array( $this, 'update' ) );
			add_action( 'upgrader_process_complete', array( $this, 'purge' ), 10, 2 );
		}

		/**
		 * Request update info from remote.
		 *
		 * @return object|false Remote response object or false on failure.
		 */
		public function request() {

			$remote = get_transient( $this->cache_key );

			if ( false === $remote || ! $this->cache_allowed ) {

				$remote = wp_remote_get(
					$this->updater_json,
					array(
						'timeout' => 10,
						'headers' => array(
							'Accept' => 'application/json',
						),
					)
				);

				if (
					is_wp_error( $remote )
					|| 200 !== wp_remote_retrieve_response_code( $remote )
					|| empty( wp_remote_retrieve_body( $remote ) )
				) {
					return false;
				}

				set_transient( $this->cache_key, $remote, MINUTE_IN_SECONDS );

			}

			$remote = json_decode( wp_remote_retrieve_body( $remote ) );

			return $remote;
		}

		/**
		 * Filter plugins_api response with our update info.
		 *
		 * @param object $res    Result object.
		 * @param string $action API action.
		 * @param object $args   Request args.
		 * @return object Result.
		 */
		public function info( $res, $action, $args ) {

			// do nothing if you're not getting plugin information right now
			if ( 'plugin_information' !== $action ) {
				return $res;
			}

			// do nothing if it is not our plugin (slug can be basename or directory name)
			$plugin_dir = dirname( $this->plugin_slug );
			if ( $this->plugin_slug !== $args->slug && $plugin_dir !== $args->slug ) {
				return $res;
			}

			// get updates
			$remote = $this->request();

			if ( ! $remote ) {
				return $res;
			}

			$res = new stdClass();

			$res->name           = $remote->name;
			$res->slug           = $remote->slug;
			$res->version        = $remote->version;
			$res->tested         = $remote->tested;
			$res->requires       = $remote->requires;
			$res->author         = $remote->author;
			$res->author_profile = $remote->author_profile;
			$res->download_link  = $remote->download_url;
			$res->trunk          = $remote->download_url;
			$res->requires_php   = $remote->requires_php;
			$res->last_updated   = $remote->last_updated;

			$res->sections = array(
				'description'  => $remote->sections->description,
				'installation' => $remote->sections->installation,
				'changelog'    => $remote->sections->changelog,
			);

			if ( ! empty( $remote->banners ) ) {
				$res->banners = array(
					'low'  => $remote->banners->low,
					'high' => $remote->banners->high,
				);
			}

			return $res;
		}

		/**
		 * Filter site_transient_update_plugins with our plugin update data.
		 *
		 * @param object $transient Update plugins transient.
		 * @return object Modified transient.
		 */
		public function update( $transient ) {

			if ( empty( $transient->checked ) ) {
				return $transient;
			}

			$remote = $this->request();

			if (
				$remote
				&& version_compare( $this->version, $remote->version, '<' )
				&& version_compare( $remote->requires, get_bloginfo( 'version' ), '<=' )
				&& version_compare( $remote->requires_php, PHP_VERSION, '<' )
			) {
				$res              = new stdClass();
				$res->slug        = $this->plugin_slug;
				$res->plugin      = $this->plugin_slug;
				$res->new_version = $remote->version;
				$res->tested      = $remote->tested;
				$res->package     = $remote->download_url;

				$transient->response[ $res->plugin ] = $res;

			}

			return $transient;
		}

		/**
		 * Purge update cache after plugin upgrade.
		 *
		 * @param object $upgrader Upgrader instance.
		 * @param array  $options  Upgrade options.
		 */
		public function purge( $upgrader, $options ) {

			if (
				$this->cache_allowed
				&& 'update' === $options['action']
				&& 'plugin' === $options['type']
			) {
				// just clean the cache when new plugin version is installed
				delete_transient( $this->cache_key );
			}
		}
	}

	new ShelfRunnerUpdateChecker();

}
