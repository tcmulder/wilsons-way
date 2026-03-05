import { useNavigate } from 'react-router-dom';

/**
 * Navigate to a route after a delay
 *
 * @returns {void}
 */
export function useTimedNavigation() {
	const navigate = useNavigate();
	const timedNavigate = (props) => {
		const { route, delay } = props;
		setTimeout(() => {
			navigate(route);
		}, delay);

	};
	return timedNavigate;
}