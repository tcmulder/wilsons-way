import Flag from '../components/Flag';
import SVGFlag from '../images/pages/level-2-flag.svg?react';

/**
 * Level 2 completion screen.
 *
 * @returns {React.ReactNode} The Level2OutroPage component.
 */
const Level2OutroPage = () => {
	const levelNumber = 2;
	return (
		<div>
			<Flag svg={SVGFlag} levelNumber={levelNumber} />
		</div>
	);
};

export default Level2OutroPage;
