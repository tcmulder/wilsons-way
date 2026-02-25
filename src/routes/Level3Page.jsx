import { useSetLevel } from '../hooks/useSetLevel';
import Level from '../components/Level';

/**
 * Level 3 gameplay page.
 * 
 * @returns {React.ReactNode} The Level3Page component.`
 */
const Level3Page = () => {
	useSetLevel();
	return <Level />;
};

export default Level3Page;
