import Flag from '../components/Flag';
import { Page } from '../components/Page';

import SVGFlag from '../images/pages/level-4-flag.svg?react';

/**
 * Level 4 completion screen.
 *
 * @returns {React.ReactNode} The Level4OutroPage component.
 */
const Level4OutroPage = () => {
	const levelNumber = 4;
	return (
		<Page fullWidth={true}>
			<Flag svg={SVGFlag} levelNumber={levelNumber} />
		</Page>
	);
};

export default Level4OutroPage;
