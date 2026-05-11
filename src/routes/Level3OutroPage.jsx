import { useNavigate } from 'react-router-dom';

import Flag from '../components/Flag';
import { EightBitButton } from '../components/EightBit';
import { Page } from '../components/Page';

import SVGFlag from '../images/pages/level-3-flag.svg?react';

/**
 * Level 3 completion screen.
 *
 * @returns {React.ReactNode} The Level3OutroPage component.
 */
const Level3OutroPage = () => {
	const levelNumber = 3;
	const navigate = useNavigate();

	return (
		<Page fullWidth={true}>
			<Flag svg={SVGFlag} levelNumber={levelNumber} />
			<EightBitButton
				className="sr-8bit--br"
				label="Skip"
				onClick={() => navigate(`/level/${levelNumber}/score`)}
			/>
		</Page>
	);
};

export default Level3OutroPage;
