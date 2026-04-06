import Level from '../components/Level';
import { useSetLevel } from '../hooks/useSetLevel';

/**
 * Level 2 gameplay page.
 * 
 * @returns {React.ReactNode} The Level2Page component.`
 */
const Level2Page = () => {
	useSetLevel();
	return <Level />;
};

export default Level2Page;
