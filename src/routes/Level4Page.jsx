import Level from '../components/Level';
import { useMusicTrack } from '../hooks/useMusicTrack';
import { useSetLevel } from '../hooks/useSetLevel';

/**
 * Level 4 gameplay page.
 * 
 * @returns {React.ReactNode} The Level4Page component.`
 */
const Level4Page = () => {
	useMusicTrack('level-4');
	useSetLevel();
	return <Level />;
};

export default Level4Page;
