import { useEffect, useState } from 'react';

import { Page } from '../components/Page';
import { useScoreContext } from '../context/useContexts';
import { useGetMessage } from '../hooks/useGetMessage';
import { useTimedNavigation } from '../hooks/useTimedNavigation';

/**
 * Level 1 score screen.
 * 
 * @returns {React.ReactNode} The Level1ScorePage component.`
 */
const Level1ScorePage = () => {
	const levelNumber = 1;
	const { timedNavigate } = useTimedNavigation();
	const { score, tokens } = useScoreContext();
	const hintsMessage = useGetMessage(`level_${levelNumber}_hints`);
	const [scoreHintLine, setScoreHintLine] = useState('Missed the Memo');
	
	// See if we have a secret for this level.
	const hasLevelSecret = tokens?.some((t) => t?.token === 'secret' && Number(t?.level) === levelNumber);
	useEffect(() => {
		if (!hasLevelSecret || !hintsMessage) return;
		const lines = hintsMessage.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
		// eslint-disable-next-line react-hooks/set-state-in-effect -- random pick from fetched data
		if (lines.length) setScoreHintLine(lines[Math.floor(Math.random() * lines.length)]);
	}, [hasLevelSecret, hintsMessage]);

	useEffect(() => {
		timedNavigate({ route: `/level/${levelNumber}/transition`, delay: 3000 });
	}, [levelNumber, timedNavigate]);
	return (
		<Page>
			<h1>Level {levelNumber} Score</h1>
			<h2>Total Score: {score?.reduce((acc, curr) => acc + (Number(curr?.num) || 0), 0) || 0}</h2>
			<h2>Level {levelNumber} Score: {score?.reduce((acc, curr) => acc + (Number(curr?.num) || 0), 0) || 0}</h2>
			<h2>Level {levelNumber} Token:</h2>
			<p>{scoreHintLine}</p>
		</Page>
	);
};

export default Level1ScorePage;
