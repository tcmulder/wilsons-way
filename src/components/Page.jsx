import '../css/page.css';

/**
 * Full-viewport page shell: `.sr-page` > `.sr-page__inner`.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} props.fullWidth Whether to use full viewport width.
 * @param {string} props.className Class name(s) to apply to the wrapper.
 * @param {React.CSSProperties} [props.style] Applied to the outer `.sr-page` element.
 */
export const Page = ({ children, fullWidth = false, className = '', style }) => {
	const classNames = [
		'sr-page',
		className,
		fullWidth ? 'sr-page--full-width' : '',
	];
	return (
		<div className={classNames.join(' ')} style={style}>
			<div className="sr-page__inner">{children}</div>
		</div>
	);
};

