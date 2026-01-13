import { useState, useEffect } from 'react';

const SvgImage = ({ path }) => {
	const [svgAttributes, setSvgAttributes] = useState({});
	const [svgInnerHTML, setSvgInnerHTML] = useState('');

	useEffect(() => {
		const loadSvg = async () => {
			try {
				// Use dynamic import to get the SVG URL, then fetch its content
				const svgModule = await import(path);
				const response = await fetch(svgModule.default);
				const svgText = await response.text();
				
				// Parse the SVG string to extract attributes and inner content
				const parser = new DOMParser();
				const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
				const svgElement = svgDoc.querySelector('svg');
				
				if (svgElement) {
					// Extract all attributes from the SVG element
					const attributes = {};
					Array.from(svgElement.attributes).forEach(attr => {
						attributes[attr.name] = attr.value;
					});
					
					// Get the inner HTML content
					const innerHTML = svgElement.innerHTML;
					
					setSvgAttributes(attributes);
					setSvgInnerHTML(innerHTML);
				}
			} catch (error) {
				console.error(`Failed to load ${path} SVG:`, error);
				setSvgAttributes({});
				setSvgInnerHTML('');
			}
		};

		loadSvg();
	}, [path]);

	return (
		<svg {...svgAttributes} dangerouslySetInnerHTML={{ __html: svgInnerHTML }} />
	);
};

export default SvgImage;