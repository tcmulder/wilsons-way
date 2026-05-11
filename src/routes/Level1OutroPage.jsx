import { useNavigate } from 'react-router-dom';

import { useMusicTrack } from '../hooks/useMusicTrack';

import Flag from '../components/Flag';
import { Page } from '../components/Page';
import { EightBitButton } from '../components/EightBit';

import SVGFlag from '../images/pages/level-1-flag.svg?react';

/**
 * Level 1 completion screen.
 *
 * @returns {React.ReactNode} The Level1OutroPage component.
 */
const Level1OutroPage = () => {
	useMusicTrack('level-1');
	const levelNumber = 1;
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

export default Level1OutroPage;
