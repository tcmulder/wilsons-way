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