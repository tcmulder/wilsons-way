import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
/**
 * Page if you lost all your lives
 */
const LostPage = () => {
	const navigate = useNavigate();
	useEffect(() => {
		setTimeout(() => {
			navigate('/');
		}, 3000);
	}, [navigate]);
	return (
		<div>
			<h1>Battery Depleted</h1>
			<p>You're not a loser. You tried. You're a failure.</p>
		</div>
	);
};

export default LostPage;