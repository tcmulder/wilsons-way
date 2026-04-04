import Flag from '../components/Flag';
import SVGFlag from '../images/pages/level-3-flag.svg?react';

/**
 * Level 3 completion screen.
 *
 * @returns {React.ReactNode} The Level3OutroPage component.
 */
const Level3OutroPage = () => {
	const levelNumber = 3;
	return (
		<div>
			<Flag svg={SVGFlag} levelNumber={levelNumber} />
		</div>
	);
};

export default Level3OutroPage;
