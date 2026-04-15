import { useEffect, useState } from 'react';

import { Image } from './Image';
import { useScoreContext } from '../context/useContexts';
import { useGetMessage } from '../hooks/useGetMessage';

import Heading from '../images/text/great-outcomes-well-done.svg?metadata';
import Envelope from '../images/envelope.svg?metadata';

import '../css/score.css';

/**
 * Reusable score display for a given level.
 *
 * @param {Object} props
 * @param {number} props.levelNumber The level whose score to display.
 * @returns {React.ReactNode} The Score component.
 */
export const Score = ({ levelNumber }) => {
	const { score, tokens } = useScoreContext();
	const hintsMessage = useGetMessage(`level_${levelNumber}_hints`);
	const missedMemoMessage = useGetMessage('missed_hints');
	const [scoreHintLine, setScoreHintLine] = useState('Missed the Memo');

	// See if we have a secret for this level.
	const hasLevelSecret = tokens?.some((t) => t?.token === 'secret' && Number(t?.level) === levelNumber);
	useEffect(() => {
		if (hasLevelSecret && hintsMessage) {
			const lines = hintsMessage.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
			// eslint-disable-next-line react-hooks/set-state-in-effect -- random pick from fetched data
			if (lines.length) setScoreHintLine(lines[Math.floor(Math.random() * lines.length)]);
		} else {
			setScoreHintLine(missedMemoMessage);
		}
	}, [hasLevelSecret, hintsMessage, missedMemoMessage]);

	const totalScore = score?.reduce((acc, curr) => acc + (Number(curr?.num) || 0), 0) || 0;
	const levelScore = score?.reduce((acc, curr) => acc + (curr?.level === levelNumber ? (Number(curr?.num) || 0) : 0), 0) || 0;

	return (
		<div className="sr-score">
			<h1>
				<Image {...Heading} alt={`Great outcomes. Well done. Level ${levelNumber} scores below.`} />
			</h1>
			<div className="sr-score__split">
				<div className="sr-score__column">
					<div className="sr-score__level">
						<h2>Level {levelNumber} Score:</h2>
						<div>{levelScore}</div>
					</div>
					<div className="sr-score__total">
						<h2>Current Total:</h2>
						<div>{totalScore}</div>
					</div>
				</div>
				<div className="sr-score__column">
					<div className="sr-score__message">
						<Image {...Envelope} alt="Envelope" />
						<h2>Secret Message:</h2>
						<p>"{scoreHintLine}"</p>
					</div>
				</div>
			</div>
		</div>
	);
};
