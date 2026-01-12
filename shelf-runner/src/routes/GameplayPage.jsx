import { useGameContext } from '../context/useGameContext';

const GameplayPage = () => {
	const { theme } = useGameContext();
	return <div>GameplayPage! {theme}</div>;
};

export default GameplayPage;