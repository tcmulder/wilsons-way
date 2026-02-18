import { useSetupGameplayElements } from '../hooks/useSetupGameplayEls';
import { useSetupGameplayElevations } from '../hooks/useSetupGameplayElevations';
import { useMovementTicker } from '../hooks/useMovementTicker';

const Gameplay = ({ boardRef }) => {
	useSetupGameplayElements(boardRef);
	useSetupGameplayElevations();
	useMovementTicker();

	return null;
};

export default Gameplay;