import { readFileSync } from 'node:fs';
import react from '@vitejs/plugin-react';
import imageSize from 'image-size';
import { defineConfig, normalizePath } from 'vite';
import usePHP, { EPHPError } from 'vite-plugin-php';
import svgr from 'vite-plugin-svgr';

const IMG_METADATA_PREFIX = '\0img-metadata:';
const IMG_METADATA_QUERY = '?metadata';

/** `*.{png,jpg,jpeg,gif,webp,svg}?metadata` → default export `{ src, width, height }` */
function imageMetadata() {
	return {
		name: 'vite-plugin-image-metadata',
		enforce: 'pre',
		async resolveId(source, importer, options) {
			if (!source.endsWith(IMG_METADATA_QUERY)) return null;
			const withoutQuery = source.slice(0, -IMG_METADATA_QUERY.length);
			const resolved = await this.resolve(withoutQuery, importer, {
				skipSelf: true,
				...options,
			});
			if (!resolved) return null;
			return IMG_METADATA_PREFIX + resolved.id;
		},
		load(id) {
			if (!id.startsWith(IMG_METADATA_PREFIX)) return null;
			const filePath = id.slice(IMG_METADATA_PREFIX.length);
			this.addWatchFile(filePath);
			const dims = imageSize(readFileSync(filePath));
			const w = dims.width;
			const h = dims.height;
			if (w == null || h == null) {
				this.warn(`image-metadata: could not read dimensions for ${filePath}`);
			}
			const specifier = `${normalizePath(filePath)}?url`;
			return [
				`import src from ${JSON.stringify(specifier)};`,
				`export default { src, width: ${w ?? 'undefined'}, height: ${h ?? 'undefined'} };`,
			].join('\n');
		},
	};
}

export default defineConfig(({ command }) => {
	const config = {
		plugins: [
			imageMetadata(),
			react(),
			svgr({
				include: '**/*.svg?react',
			}),
		],
		build: {
			manifest: 'manifest.json',
			outDir: 'dist',
			assetsDir: 'assets',
			assetsInlineLimit: 0,
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
