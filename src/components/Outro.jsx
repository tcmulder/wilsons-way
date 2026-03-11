import { Link } from 'react-router-dom';
import Message from './Message';

/**
 * 
 * @param {Object} props The properties object
 * @param {number} props.levelNumber The level number (not from state)
 * @returns 
 */
const Outro = (props) => {
	const { levelNumber } = props;
	return (
		<>
			<h1>You've completed Level {levelNumber}!</h1>
			<Message messageKey={`level_${levelNumber}_outro`} />
			<Link to={`/level/${levelNumber + 1}`}>
				Load Level {levelNumber + 1} &gt;&gt;
			</Link>
		</>
	);
};

export default Outro;