import Level from '../components/Level';
import { useMusicTrack } from '../hooks/useMusicTrack';
import { useSetLevel } from '../hooks/useSetLevel';

/**
 * Level 1 gameplay page.
 * 
 * @returns {React.ReactNode} The Level1Page component.`
 */
const Level1Page = () => {
	useMusicTrack('level-1');
	useSetLevel();
	return <Level />;
};

export default Level1Page;
