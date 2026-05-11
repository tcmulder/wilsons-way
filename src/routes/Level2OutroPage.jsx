import { useNavigate } from 'react-router-dom';

import { useMusicTrack } from '../hooks/useMusicTrack';

import Flag from '../components/Flag';
import { EightBitButton } from '../components/EightBit';
import { Page } from '../components/Page';

import SVGFlag from '../images/pages/level-2-flag.svg?react';

/**
 * Level 2 completion screen.
 *
 * @returns {React.ReactNode} The Level2OutroPage component.
 */
const Level2OutroPage = () => {
	useMusicTrack('level-2');
	const levelNumber = 2;
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

export default Level2OutroPage;
