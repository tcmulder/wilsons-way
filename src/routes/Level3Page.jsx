import Level from '../components/Level';
import { useMusicTrack } from '../hooks/useMusicTrack';
import { useSetLevel } from '../hooks/useSetLevel';

/**
 * Level 3 gameplay page.
 * 
 * @returns {React.ReactNode} The Level3Page component.`
 */
const Level3Page = () => {
	useMusicTrack('level-3');
	useSetLevel();
	return <Level />;
};

export default Level3Page;
