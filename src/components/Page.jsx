import '../css/page.css';

/**
 * Full-viewport page shell: `.sr-page` > `.sr-page__inner`.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} props.className Class name(s) to apply to the wrapper.
 * @param {React.CSSProperties} [props.style] Applied to the outer `.sr-page` element.
 */
export const Page = ({ children, className = '', style }) => {
	return (
		<div className={`sr-page${className && ` ${className}`}`} style={style}>
			<div className="sr-page__inner">{children}</div>
		</div>
	);
};

