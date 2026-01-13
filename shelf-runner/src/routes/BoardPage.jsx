import { useGameContext } from '../context/useGameContext';
import SvgImage from '../components/SvgImage';

const GameplayPage = () => {
	const { level } = useGameContext();
	return (
		<div className="sr-board">
			<SvgImage path={`../svg/level-${level}.svg`} />
		</div>
	);
};

export default GameplayPage;