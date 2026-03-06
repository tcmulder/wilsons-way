import { Link } from 'react-router-dom';

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
			<Link to={`/level/${levelNumber + 1}`}>
				Load Level {levelNumber + 1} &gt;&gt;
			</Link>
		</>
	);
};

export default Outro;