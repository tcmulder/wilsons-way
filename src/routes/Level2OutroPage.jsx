import Flag from '../components/Flag';
import { Page } from '../components/Page';

import SVGFlag from '../images/pages/level-2-flag.svg?react';

/**
 * Level 2 completion screen.
 *
 * @returns {React.ReactNode} The Level2OutroPage component.
 */
const Level2OutroPage = () => {
	const levelNumber = 2;
	return (
		<Page>
			<Flag svg={SVGFlag} levelNumber={levelNumber} />
		</Page>
	);
};

export default Level2OutroPage;
