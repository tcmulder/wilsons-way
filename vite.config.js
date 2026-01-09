import { defineConfig } from 'vite';
import usePHP, { EPHPError } from 'vite-plugin-php';

export default defineConfig(({ command }) => {
	const config = {
		plugins: [],
		build: {
			manifest: 'manifest.json',
			rollupOptions: {
				input: {
					main: './src/js/index.js',
					shortcode: './src/js/shortcode.js',
					svg: './src/svg/svg.js',
				},
				output: {
					entryFileNames: '[name][hash].js',
					dir: './dist',
				},
			},
		},
	};

	if (command === 'serve') {
		config.plugins.push(
			usePHP({
				dev: {
					entry: ['index.php'],
					errorLevels: [EPHPError.ERROR | EPHPError.WARNING],
				},
			}),
		);
	} else {
		config.base = '/wp-content/plugins/shelf-runner/dist/';
	}

	return config;
});
