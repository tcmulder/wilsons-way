import { useId, useRef, useEffect, useState } from 'react';
import '../css/background-radius.css';

/**
 * Corner shape (a nested SVG).
 * 
 * @param {Object} props - The props for the Corner component.
 * @param {string} props.pos - The position of the corner in the format [x, y].
 * @param {number} props.rotate - The rotation of the corner in degrees.
 * @param {number} props.size - The size of the corner in pixels.
 * @returns {React.ReactNode} The Corner component.
 */
const Corner = (props) => {
	const { pos, scale, rotate = 0, borderRadius, isMask=false } = props;
	const [x, y] = pos;
	const offsetX = x > 50 ? -borderRadius : 0;
	const offsetY = y > 50 ? -borderRadius : 0;
	return (
		<svg
			x={`${x}%`}
			y={`${y}%`}
			width={borderRadius}
			height={borderRadius}
			overflow="visible"
		>
			<g transform={`translate(${offsetX}, ${offsetY})`}>
				<g transform={`rotate(${rotate}, ${borderRadius / 2}, ${borderRadius / 2}) scale(${scale})`}>
					<path fill="var(--c-bd)" d="M22 4h-6v4H8v8H4v6H0V12h4V4h8V0h10z"/>
					<path fill="var(--c-bg)" d="M22 22H4v-6h4V8h8V4h6z"/>
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
export const BackgroundRadius = (props) => {
	const { scale = 1, className, children } = props;
	const id = useId();
	const parentRef = useRef(null);
	const svgRef = useRef(null);
	const [viewBox, setViewBox] = useState("0 0 100 100");

	useEffect(() => {
		const observer = new ResizeObserver(([entry]) => {
			const { width, height } = entry.contentRect;
			setViewBox(`0 0 ${width} ${height}`);
		});
		observer.observe(parentRef.current);
		return () => observer.disconnect();
	}, []);
	const borderRadius = 22;
	const borderWidth = 4 * scale;
	return (
		<div ref={parentRef} className={`sr-background-radius ${className}`}>
			<svg ref={svgRef} className="sr-background-radius__svg" viewBox={viewBox} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
				<defs>
					<mask id={`background-radius-mask-${id}`} maskUnits="userSpaceOnUse" style={{ maskType: "luminance" }}>
						<rect width="100%" height="100%" fill="white"/>
						<Corner isMask={true} pos={[0, 0]} scale={scale} borderRadius={borderRadius} />
						<Corner isMask={true} pos={[100, 0]} scale={scale} borderRadius={borderRadius} />
						<Corner isMask={true} pos={[100, 100]} scale={scale} borderRadius={borderRadius} />
						<Corner isMask={true} pos={[0, 100]} scale={scale} borderRadius={borderRadius} />
					</mask>
				</defs>
				<rect x={borderWidth} y={borderWidth} width={`calc(100% - ${borderWidth * 2}px)`} height={`calc(100% - ${borderWidth * 2}px)`} fill="var(--c-bg)" mask={`url(#background-radius-mask-${id})`}/>
				<rect width="100%" height="100%" fill="none" stroke="var(--c-bd)" strokeWidth={borderWidth * 2} mask={`url(#background-radius-mask-${id})`}/>
				{/* NOTE: we fudge over the masks a bit to avoid subpixel rendering quirks */}
				<Corner pos={[0.05, 0.05]} scale={scale} rotate={0} borderRadius={borderRadius} />
				<Corner pos={[99.9, 0.05]} scale={scale} rotate={90} borderRadius={borderRadius} />
				<Corner pos={[99.9, 99.9]} scale={scale} rotate={180} borderRadius={borderRadius} />
				<Corner pos={[0.05, 99.9]} scale={scale} rotate={270} borderRadius={borderRadius} />
			</svg>
			<span className="sr-background-radius__content">
				{children}
			</span>
		</div>
	);
};
