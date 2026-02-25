import { useSetLevel } from '../hooks/useSetLevel';
import Level from '../components/Level';

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
