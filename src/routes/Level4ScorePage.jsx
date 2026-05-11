import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMusicTrack } from '../hooks/useMusicTrack';

import { EightBitButton } from '../components/EightBit';
import { Page } from '../components/Page';
import { Score } from '../components/Score';
import { useTimedNavigation } from '../hooks/useTimedNavigation';

import backgroundUrl from '../images/pages/page-bg-dark.svg';

/**
 * Level 4 score screen.
 *
 * @returns {React.ReactNode} The Level4ScorePage component.
 */
const Level4ScorePage = () => {
	useMusicTrack('level-4');
	const levelNumber = 4;
	const navigate = useNavigate();
	const { timedNavigate } = useTimedNavigation();

	useEffect(() => {
		timedNavigate({ route: `/level/${levelNumber}/transition`, delay: 6000 });
	}, [levelNumber, timedNavigate]);

	return (
		<Page style={{ '--sr-bg-image': `url(${backgroundUrl})` }} className="sr-page--score">
			<Score levelNumber={levelNumber} />
			<EightBitButton
				className="sr-8bit--br"
				label="Skip"
				onClick={() => navigate(`/level/${levelNumber}/transition`)}
			/>
		</Page>
	);
};

export default Level4ScorePage;
