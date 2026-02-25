import { useSetLevel } from '../hooks/useSetLevel';
import Level from '../components/Level';

/**
 * Level 4 gameplay page.
 * 
 * @returns {React.ReactNode} The Level4Page component.`
 */
const Level4Page = () => {
	useSetLevel();
	return <Level />;
};

export default Level4Page;
