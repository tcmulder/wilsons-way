import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook to navigate to a route after a delay.
 */
export function useTimedNavigation() {
	const navigate = useNavigate();
	const timeoutRef = useRef(null);

	// Clear any pending timeout when the component using this hook unmounts
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	// Navigate after a timeout
	const timedNavigate = ({ route, delay }) => {
		// If there is already a scheduled navigation, clear it first
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		timeoutRef.current = setTimeout(() => {
			navigate(route);
		}, delay);
	};

	// Cancel any pending navigation
	const cancelNavigation = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	};

	return { timedNavigate, cancelNavigation };
}