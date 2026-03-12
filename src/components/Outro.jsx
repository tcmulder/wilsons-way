import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTimedNavigation } from '../hooks/useTimedNavigation';
import Message from './Message';

/**
 * 
 * @param {Object} props The properties object
 * @param {number} props.levelNumber The level number (not from state)
 * @returns 
 */
const Outro = (props) => {
	const { levelNumber } = props;
	const { timedNavigate } = useTimedNavigation();

	// Auto-navigate to transition page
	useEffect(() => {
		timedNavigate({ route: `/level/${levelNumber + 1}/transition`, delay: 3000 });
	}, [levelNumber, timedNavigate]);

	return (
		<>
			<h1>You've completed Level {levelNumber}!</h1>
			<p>Your score and stuff will be shown here</p>
			<Message messageKey={`level_${levelNumber}_outro`} />
		</>
	);
};

export default Outro;