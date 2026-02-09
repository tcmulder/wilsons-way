import { useSetupGameplayElements } from '../hooks/useSetupGameplayEls';
import { useSetupGameplayElevations } from '../hooks/useSetupGameplayElevations';

const Gameplay = ({ boardRef }) => {
	useSetupGameplayElements(boardRef);
	useSetupGameplayElevations();

	return null;
};

export default Gameplay;