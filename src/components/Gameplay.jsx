import { useSetupGameplayElements } from '../hooks/useSetupGameplayEls';
import { useSetupGameplayElevations } from '../hooks/useSetupGameplayElevations';
import { useMovementTicker } from '../hooks/useMovementTicker';

/**
 * Orchestrates gameplay hooks: element refs, elevations, and movement ticker. Renders nothing.
 * 
 * @param {Object} props The properties object
 * @param {React.RefObject} props.boardRef Reference to the board element
 * @returns {React.ReactNode} The Gameplay component.
 */
const Gameplay = ({ boardRef }) => {
	useSetupGameplayElements(boardRef);
	useSetupGameplayElevations();
	useMovementTicker();
	return null;
};

export default Gameplay;