/**
 * Image component.
 * 
 * Scales the image to the viewport width and height and provides
 * an alt text fallback based on the filename.
 * 
 * @param {Object} props 
 * @param {string} props.src The source URL of the image.
 * @param {string} props.alt The alt text for the image.
 * @param {string} props.className The class name for the image.
 * @param {number} props.width The width of the image.
 * @param {number} props.height The height of the image.
 * @returns {React.ReactNode} The Image component.
 */
export const Image = (props) => {
	const { src, alt, className, width, height } = props;
	// If no alt text is provided then the filename as the alt text
	const altText = alt || src.split('/').pop().replace(/[-_]/g, ' ').replace(/\.[^.]+$/, '').toLowerCase();
	return (
		<img
			src={src}
			alt={altText}
			className={className}
			style={{
				width: `calc((${width} / var(--sr-w)) * 100cqmax)`,
				height: `calc((${height} / var(--sr-w)) * 100cqmax)`,
			}}
		/>
	);
};