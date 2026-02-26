import { useState, useEffect } from 'react';
import { convertClassToData } from '../util/convertClassToData';

/**
 * Loads an SVG from path. If onSvgLoad is provided, passes the parsed SVG to it and renders nothing;
 * otherwise converts classes to data attrs and renders the SVG inline.
 *
 * @param {Object} props
 * @param {string} props.path URL (http(s)) or Vite-import path to the SVG.
 * @param {(el: SVGElement) => void} [props.onSvgLoad] Callback with the parsed SVG element; when set, component does not render.
 * @returns {React.ReactNode} The SvgImage component.
 */
const SvgImage = ({ path, onSvgLoad }) => {
	const [svgAttributes, setSvgAttributes] = useState({});
	const [svgInnerHTML, setSvgInnerHTML] = useState('');

	useEffect(() => {
		const loadSvg = async () => {
			try {
				let svgUrl;
				// Check if path is a direct URL (starts with http:// or https://)
				// If so, fetch directly; otherwise use Vite's import for build-processed assets
				if (path.startsWith('http://') || path.startsWith('https://')) {
					// Direct URL - fetch it directly
					svgUrl = path;
				} else {
					// Vite-processed asset - use dynamic import
					const svgModule = await import(/* @vite-ignore */ path);
					svgUrl = svgModule.default;
				}
				const response = await fetch(svgUrl);
				const svgText = await response.text();
				
				// Parse the SVG string to extract attributes and inner content
				const parser = new DOMParser();
				const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
				const svgElement = svgDoc.querySelector('svg');
				
				if (svgElement) {
					// If callback provided, call it with the parsed SVG element
					if (onSvgLoad) {
						// Import the SVG element into the current document
						const importedSvg = document.importNode(svgElement, true);
						// Convert classes to data attributes on the cloned element that will be used
						convertClassToData(importedSvg);
						onSvgLoad(importedSvg);
					} else {
						// Convert classes to data attributes before extracting attributes
						convertClassToData(svgElement);
						// Otherwise, extract attributes and innerHTML for rendering
						const attributes = {};
						Array.from(svgElement.attributes).forEach(attr => {
							attributes[attr.name] = attr.value;
						});
						
						// Get the inner HTML content
						const innerHTML = svgElement.innerHTML;
						
						setSvgAttributes(attributes);
						setSvgInnerHTML(innerHTML);
					}
				}
			} catch (error) {
				console.error(`Failed to load ${path} SVG:`, error);
				if (!onSvgLoad) {
					setSvgAttributes({});
					setSvgInnerHTML('');
				}
			}
		};

		loadSvg();
	}, [path, onSvgLoad]);

	// If onSvgLoad is provided, don't render (the callback handles it)
	if (onSvgLoad) return null;

	return (
		<svg {...svgAttributes} dangerouslySetInnerHTML={{ __html: svgInnerHTML }} />
	);
};

export default SvgImage;