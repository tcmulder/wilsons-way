import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDebugContext } from '../context/useContexts';

/**
 * Hook to navigate to a route after a delay.
 */
export function useTimedNavigation() {
	const navigate = useNavigate();
	const { debug } = useDebugContext();
	const timeoutRef = useRef(null);

	// Clear any pending timeout on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		};
	}, []);

	// Navigate after a timeout
	const timedNavigate = ({ route, delay }) => {

		// If there is already a scheduled navigation, clear it first
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		// Schedule the navigation
		timeoutRef.current = setTimeout(() => {
			// Bail if slideshow is disabled in debug mode
			if (debug?.slideshow === false) {
				console.error(`🐜 Debug: cancelling ${route} timer`);
				return;
			}
			navigate(route);
		}, delay);
	};

	return { timedNavigate };
}
