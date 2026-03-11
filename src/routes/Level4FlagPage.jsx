import Flag from '../components/Flag';
import SVGFlag from '../images/pages/level-4-flag.svg?react';

/**
 * Level 4 completion screen.
 * 
 * @returns {React.ReactNode} The Level4FlagPage component.
 */
const Level4FlagPage = () => {
	return (
		<div>
			<Flag svg={SVGFlag} levelNumber={4} />			
		</div>
	);
};

export default Level4FlagPage;

