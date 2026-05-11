import { useNavigate } from 'react-router-dom';

import { useMusicTrack } from '../hooks/useMusicTrack';

import Flag from '../components/Flag';
import { EightBitButton } from '../components/EightBit';
import { Page } from '../components/Page';

import SVGFlag from '../images/pages/level-4-flag.svg?react';

/**
 * Level 4 completion screen (flag only; fireworks are on Level4TransitionPage).
 *
 * @returns {React.ReactNode} The Level4OutroPage component.
 */
const Level4OutroPage = () => {
	useMusicTrack('level-4');
	const levelNumber = 4;
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

export default Level4OutroPage;
