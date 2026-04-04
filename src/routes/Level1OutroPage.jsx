import Flag from '../components/Flag';
import Page from '../components/Page';
import SVGFlag from '../images/pages/level-1-flag.svg?react';

/**
 * Level 1 completion screen.
 *
 * @returns {React.ReactNode} The Level1OutroPage component.
 */
const Level1OutroPage = () => {
	const levelNumber = 1;
	return (
		<Page>
			<Flag svg={SVGFlag} levelNumber={levelNumber} />
		</Page>
	);
};

export default Level1OutroPage;
