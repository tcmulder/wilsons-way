import SVGCircle from '../images/interface/8bit-circle.svg?react';
import SVGToggleBar from '../images/interface/8bit-toggle-bar.svg?react';

import '../css/8bit.css';

/**
 * Main bit background container
 * 
 * @param {React.ReactNode} props.children - The children to render inside the background.
 * @returns 
 */
export const EightBit = (props) => {
	const { bg, className = '', children, style, tag = 'div' } = props;
	const Tag = tag;
	return (
		<Tag className={`sr-8bit${className && ` ${className}`}`} style={style}>
			<div className="sr-8bit__bg">
				{bg}
			</div>
			<div className="sr-8bit__fg">
				{children}
			</div>
		</Tag>
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
 * Rounded 8bit toggle bar
 */
export const EightBitToggleBar = () => {
	return (
		<div className="sr-8bit__toggle-bar">
			<SVGToggleBar />
		</div>
	);
};

/**
 * @param {Object} props - The properties object
 * @param {string} props.label - The button label
 * @param {() => void} props.onClick - The button click handler
 * @param {string} [props.type] Button type (defaults to 'button')
 * @param {boolean} [props.disabled] Whether the button is disabled (defaults to false)
 * @returns {React.ReactNode} The EightBitButton component.
 */
export const EightBitButton = (props) => {
	const { label, onClick, type = 'button', disabled = false } = props;
	return (
		<EightBit bg={<EightBitPill />} className="sr-8bit--button">
			<button type={type} onClick={onClick} disabled={disabled}>{label}</button>
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
		<EightBit bg={<EightBitToggleBar />} className="sr-8bit--toggle" tag="label">
			{label}
			<input type="checkbox" checked={value} onChange={onChange} />
		</EightBit>
	);
};