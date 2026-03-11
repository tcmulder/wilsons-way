import Flag from '../components/Flag';
import SVGFlag from '../images/pages/level-3-flag.svg?react';

/**
 * Level 3 completion screen.
 * 
 * @returns {React.ReactNode} The Level3FlagPage component.
 */
const Level3FlagPage = () => {
	return (
		<div>
			<Flag svg={SVGFlag} levelNumber={3} />			
		</div>
	);
};

export default Level3FlagPage;

