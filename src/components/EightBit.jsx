import SVGCircle from '../images/8bit-circle.svg?react';
import '../css/8bit.css';

/**
 * Main bit background container
 * 
 * @param {React.ReactNode} props.children - The children to render inside the background.
 * @returns 
 */
export const EightBit = (props) => {
	const { bg, className = '', children } = props;
	return (
		<div className={`sr-8bit ${className}`}>
			<div className="sr-8bit__bg">
				{bg}
			</div>
			<div className="sr-8bit__fg">
				{children}
			</div>
		</div>
	);
};

/**
 * Simple rounded 8bit circle.
 * 
 * @returns {React.ReactNode} The EightBit component.
 */
export const EightBitCircle = () => {
	return <SVGCircle />;
};

/**
 * Rounded 8bit pill.
 */
export const EightBitPill = () => {
	return (
		<div className="sr-8bit__pill">
			<div className="sr-8bit__pill-piece"><SVGCircle width="27.5" /></div>
			<div className="sr-8bit__pill-piece"><SVGCircle width="27.5" viewBox="27.5 0 55 55" /></div>
		</div>
	);
};