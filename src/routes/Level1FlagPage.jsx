import Flag from '../components/Flag';
import SVGFlag from '../images/pages/level-1-flag.svg?react';

/**
 * Level 1 completion screen.
 * 
 * @returns {React.ReactNode} The Level1OutroPage component.`
 */
const Level1FlagPage = () => {
	return (
		<div>
			<Flag svg={SVGFlag} levelNumber={1} />			
		</div>
	);
};

export default Level1FlagPage;
