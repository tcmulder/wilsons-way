import Level from '../components/Level';
import { useSetLevel } from '../hooks/useSetLevel';

/**
 * Level 1 gameplay page.
 * 
 * @returns {React.ReactNode} The Level1Page component.`
 */
const Level1Page = () => {
	useSetLevel();
	return <Level />;
};

export default Level1Page;
