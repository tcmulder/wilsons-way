import { useId } from 'react';
import '../css/background-radius.css';

/**
 * Corner shape (a nested SVG).
 * 
 * @param {Object} props - The props for the Corner component.
 * @param {string} props.pos - The position of the corner in the format [x, y].
 * @param {number} props.rotate - The rotation of the corner in degrees.
 * @param {number} props.size - The size of the corner in pixels.
 * @param {string} props.borderColor - The color of the border.
 * @param {string} props.backgroundColor - The color of the background.
 * @returns {React.ReactNode} The Corner component.
 */
const Corner = (props) => {
	const { pos, rotate, borderRadius, borderColor, backgroundColor, isMask=false } = props;
	const [x, y] = pos;
	const offsetX = x === 100 ? -borderRadius : 0;
	const offsetY = y === 100 ? -borderRadius : 0;
	return (
		<svg
			x={`${x}%`}
			y={`${y}%`}
			width={borderRadius}
			height={borderRadius}
			overflow="visible"
		>
			<g transform={`translate(${offsetX}, ${offsetY})`}>
				<g transform={`rotate(${rotate}, ${borderRadius / 2}, ${borderRadius / 2})`}>
					<path fill={borderColor} d="M22 4h-6v4H8v8H4v6H0V12h4V4h8V0h10z"/>
					<path fill={backgroundColor} d="M22 22H4v-6h4V8h8V4h6z"/>
					{isMask && <rect x="0" y="0" width={borderRadius} height={borderRadius} fill="black"/>}
				</g>
			</g>
		</svg>
	);
};

/**
 * SVG background with 8bit "rounded" corners
 * 
 * @param {React.ReactNode} props.children - The children to render inside the background.
 * @returns 
 */
const BackgroundRadius = (props) => {
	const { children, backgroundColor, borderColor } = props;
	const id = useId();
	const borderRadius = 22;
	const borderWidth = 4;
	return (
		<div className="sr-background-radius">
			<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<mask id={`background-radius-mask-${id}`} maskUnits="userSpaceOnUse" style={{ maskType: "luminance" }}>
						<rect width="100%" height="100%" fill="white"/>
						<Corner isMask={true} pos={[0, 0]} rotate={0} borderRadius={borderRadius} borderColor={borderColor} backgroundColor={backgroundColor} />
						<Corner isMask={true} pos={[100, 0]} rotate={0} borderRadius={borderRadius} borderColor={borderColor} backgroundColor={backgroundColor} />
						<Corner isMask={true} pos={[100, 100]} rotate={0} borderRadius={borderRadius} borderColor={borderColor} backgroundColor={backgroundColor} />
						<Corner isMask={true} pos={[0, 100]} rotate={0} borderRadius={borderRadius} borderColor={borderColor} backgroundColor={backgroundColor} />
					</mask>
				</defs>
				<rect x={borderWidth} y={borderWidth} width={`calc(100% - ${borderWidth * 2}px)`} height={`calc(100% - ${borderWidth * 2}px)`} fill={backgroundColor} mask={`url(#background-radius-mask-${id})`}/>
				<rect width="100%" height="100%" fill="none" stroke={borderColor} stroke-width={borderWidth * 2} mask={`url(#background-radius-mask-${id})`}/>
				<Corner pos={[0, 0]} rotate={0} borderRadius={borderRadius} borderColor={borderColor} backgroundColor={backgroundColor} />
				<Corner pos={[100, 0]} rotate={90} borderRadius={borderRadius} borderColor={borderColor} backgroundColor={backgroundColor} />
				<Corner pos={[100, 100]} rotate={180} borderRadius={borderRadius} borderColor={borderColor} backgroundColor={backgroundColor} />
				<Corner pos={[0, 100]} rotate={270} borderRadius={borderRadius} borderColor={borderColor} backgroundColor={backgroundColor} />
			</svg>
			{children}
		</div>
	);
};

export default BackgroundRadius;