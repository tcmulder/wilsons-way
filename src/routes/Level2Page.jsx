import Level from '../components/Level';
import { useMusicTrack } from '../hooks/useMusicTrack';
import { useSetLevel } from '../hooks/useSetLevel';

/**
 * Level 2 gameplay page.
 * 
 * @returns {React.ReactNode} The Level2Page component.`
 */
const Level2Page = () => {
	useMusicTrack('level-2');
	useSetLevel();
	return <Level />;
};

export default Level2Page;
