import { useMovementTicker } from '../hooks/useMovementTicker';
import { useSetupGameplayElevations } from '../hooks/useSetupGameplayElevations';
import { useSetupGameplayElements } from '../hooks/useSetupGameplayEls';
import { useSetupGameplayNavigation } from '../hooks/useSetupGameplayNavigation';

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
	useSetupGameplayNavigation();
	useMovementTicker();
	return null;
};

export default Gameplay;