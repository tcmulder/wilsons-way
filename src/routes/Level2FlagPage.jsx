import Flag from '../components/Flag';
import SVGFlag from '../images/pages/level-2-flag.svg?react';

/**
 * Level 2 completion screen.
 * 
 * @returns {React.ReactNode} The Level2FlagPage component.
 */
const Level2FlagPage = () => {
	return (
		<div>
			<Flag svg={SVGFlag} levelNumber={2} />			
		</div>
	);
};

export default Level2FlagPage;

