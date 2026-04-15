import Level from '../components/Level';
import { Page } from '../components/Page';
import { useSetLevel } from '../hooks/useSetLevel';

/**
 * Level 4 gameplay page.
 * 
 * @returns {React.ReactNode} The Level4Page component.`
 */
const Level0Page = () => {
	useSetLevel();
	return (
		<Page>
			<Level />
		</Page>
	);
};

export default Level0Page;
