import { useEffect } from 'react';

import { useSettingsContext } from '../context/useContexts';


// Track requested assets to avoid duplicates
const requestedAssets = new Set();

/**
 * Preloads asset paths in the background to warm the browser cache.
 * 
 * Use `v={version}` inside an asset path to inject the current settings version
 * into that specific request without affecting the rest of the array.
 *
 * @param {Object} props
 * @param {Array<string | null | undefined>} [props.assetPaths] Asset paths or URLs to fetch.
 * @returns {null} This component does not render visible UI.
 */
export function AssetPreload({ assetPaths = [] }) {
	const { settings } = useSettingsContext();
	const { version } = settings;

	useEffect(() => {
		const urls = assetPaths
			.filter(Boolean)
			.map((assetPath) => {
				if (!assetPath.includes('v={version}')) {
					return assetPath;
				}

				if (!version) {
					return null;
				}

				return assetPath.replaceAll('v={version}', `v=${version}`);
			})
			.filter(Boolean)
			.map((assetPath) => {
				const url = assetPath.startsWith('http://') || assetPath.startsWith('https://')
					? assetPath
					: `${window.sr.url}${assetPath.replace(/^\/+/, '')}`;
				return url;
			});

		urls.forEach((url) => {
			if (requestedAssets.has(url)) {
				return;
			}

			requestedAssets.add(url);

			fetch(url)
				.then((response) => {
					if (!response.ok) {
						throw new Error(`Failed to preload asset: ${url}`);
					}
					return response.text();
				})
				.catch((error) => {
					requestedAssets.delete(url);
					console.error('Asset preload failed:', error);
				});
		});
	}, [assetPaths, version]);

	return null;
}
