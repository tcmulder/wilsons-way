import { useSetupGameplayElements } from '../hooks/useSetupGameplayEls';
import { useSetupGameplayElevations } from '../hooks/useSetupGameplayElevations';
import { useMovementTicker } from '../hooks/useMovementTicker';

/**
 * Orchestrates gameplay hooks: element refs, elevations/jump, and movement ticker. Renders nothing.
 */
const Gameplay = ({ boardRef }) => {
	useSetupGameplayElements(boardRef);
	useSetupGameplayElevations();
	useMovementTicker();

	return null;
};

export default Gameplay;