import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebugContext } from '../context/useContexts';

/**
 * Hook to navigate to a route after a delay.
 */
export function useTimedNavigation() {
	const navigate = useNavigate();
	const { debug } = useDebugContext();
	const timeoutRef = useRef(null);

	// Cancel any pending navigation
	const cancelNavigation = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
	}, []);

	// Stop auto-navigation when slideshow is disabled in debug mode
	useEffect(() => {
		if (debug?.slideshow === false) {
			cancelNavigation();
		}
	}, [debug?.slideshow, cancelNavigation]);

	// Clear any pending timeout when the component using this hook unmounts
	useEffect(() => {
		return () => {
			cancelNavigation();
		};
	}, [cancelNavigation]);

	// Navigate after a timeout
	const timedNavigate = ({ route, delay }) => {
		if (debug?.slideshow === false) {
			return;
		}

		// If there is already a scheduled navigation, clear it first
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}

		// Schedule the navigation
		timeoutRef.current = setTimeout(() => {
			navigate(route);
		}, delay);
	};

	return { timedNavigate, cancelNavigation };
}