import Flag from '../components/Flag';
import { Page } from '../components/Page';

import SVGFlag from '../images/pages/level-3-flag.svg?react';

/**
 * Level 3 completion screen.
 *
 * @returns {React.ReactNode} The Level3OutroPage component.
 */
const Level3OutroPage = () => {
	const levelNumber = 3;
	return (
		<Page fullWidth={true}>
			<Flag svg={SVGFlag} levelNumber={levelNumber} />
		</Page>
	);
};

export default Level3OutroPage;
