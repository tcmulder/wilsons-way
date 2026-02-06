import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import usePHP, { EPHPError } from 'vite-plugin-php';

export default defineConfig(({ command }) => {
	const config = {
		plugins: [react()],
		build: {
			manifest: 'manifest.json',
			outDir: 'dist',
			assetsDir: 'assets',
			rollupOptions: {
				input: {
					main: './src/main.jsx',
					shortcode: './src/util/shortcode.js',
				},
				output: {
					entryFileNames: '[name][hash].js',
					manualChunks: undefined, // Ensure all assets are properly referenced
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
