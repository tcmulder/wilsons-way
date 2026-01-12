import LevelSVG from '../components/LevelSVG';
import { useGameContext } from '../context/useGameContext';

const GameplayPage = () => {
	const { level, setLevel } = useGameContext();
	return (
		<div className="sr">
			<button onClick={() => setLevel(level + 1)}>Next Level</button>
			<LevelSVG />
		</div>
	);
};

export default GameplayPage;