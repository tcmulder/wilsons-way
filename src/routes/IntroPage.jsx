import { useNavigate } from 'react-router-dom'
const IntroPage = () => {
	const navigate = useNavigate();
	return (
		<div>
			<h1>Welcome to the Game</h1>
			<p>This is an introductory page, and content is TBD.</p>
			<button onClick={() => navigate('/gameplay')}>Start Game</button>
		</div>
	);
}

export default IntroPage