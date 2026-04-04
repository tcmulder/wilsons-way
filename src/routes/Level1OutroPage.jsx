import Flag from '../components/Flag';
import SVGFlag from '../images/pages/level-1-flag.svg?react';

/**
 * Level 1 completion screen.
 *
 * @returns {React.ReactNode} The Level1OutroPage component.
 */
const Level1OutroPage = () => {
	const levelNumber = 1;
	return (
		<div>
			<Flag svg={SVGFlag} levelNumber={levelNumber} />
		</div>
	);
};

export default Level1OutroPage;
