import SVGCircle from '../images/8bit-circle.svg?react';

import '../css/8bit.css';

/**
 * Main bit background container
 * 
 * @param {React.ReactNode} props.children - The children to render inside the background.
 * @returns 
 */
export const EightBit = (props) => {
	const { bg, className = '', children, style } = props;
	return (
		<div className={`sr-8bit${className && ` ${className}`}`} style={style}>
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
	return <div className="sr-8bit__circle"><SVGCircle /></div>;
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

/**
 * @param {Object} props
 * @param {string} props.label
 * @param {() => void} props.onClick
 * @returns {React.ReactNode}
 */
export const EightBitButton = (props) => {
	const { label, onClick } = props;
	return (
		<EightBit bg={<EightBitPill />} className="sr-8bit--button">
			<button type="button" onClick={onClick}>{label}</button>
		</EightBit>
	);
};

/**
 * @param {Object} props
 * @param {string} props.label
 * @param {boolean} props.value
 * @param {import('react').ChangeEventHandler<HTMLInputElement>} props.onChange
 * @returns {React.ReactNode}
 */
export const EightBitToggle = (props) => {
	const { label, value, onChange } = props;
	return (
		<EightBit bg={<div><EightBitCircle /><EightBitPill /></div>} className="sr-8bit--toggle">
			<label>
				<span>{label}</span>
				<input type="checkbox" checked={value} onChange={onChange} />
			</label>
		</EightBit>
	);
};