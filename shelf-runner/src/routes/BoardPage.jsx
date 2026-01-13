import { useRef } from 'react';
import { useGameContext } from '../context/useGameContext';
import { loadSvgLevel } from '../util/level';
import SvgImage from '../components/SvgImage';

const GameplayPage = () => {
	const { level } = useGameContext();
	const boardRef = useRef(null);

	const handleSvgLoad = async (svgElement) => {
		if (boardRef.current && svgElement) {
			await loadSvgLevel(boardRef.current, svgElement);
		}
	};

	return (
		<div className="sr-board" ref={boardRef}>
			<SvgImage 
				path={`../svg/level-${level}.svg?url`} 
				onSvgLoad={handleSvgLoad}
			/>
		</div>
	);
};

export default GameplayPage;