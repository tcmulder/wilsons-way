import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDebugContext, useLevelContext } from '../context/useContexts';

/**
 * Handles drag-and-drop of SVG level files over the debug panel.
 *
 * @param {React.RefObject<HTMLElement>} debugRef Ref to the .sr-debug element
 */
export function useDebugDropLevel(debugRef) {
	const { debug } = useDebugContext();
	const { setLevel, setCurrentLevelId, setCustomLevelSvg } = useLevelContext();
	const navigate = useNavigate();
	const pagePath = useLocation().pathname;

	useEffect(() => {
		const elDebug = debugRef.current;
		if (!elDebug || !debug) return;

		const handleDrop = (e) => {
			e.preventDefault();
			elDebug.classList.remove('is-dragging');
			const file = e.dataTransfer?.files[0];
			if (file?.type === 'image/svg+xml') {
				const reader = new FileReader();
				reader.onload = (e2) => {
					const svgText = String(e2.target?.result || '');
					if (!svgText) return;
					setCustomLevelSvg(svgText);
					setLevel(0);
					setCurrentLevelId(Date.now());
					if (pagePath !== '/level/0') {
						navigate('/level/0');
					}
				};
				reader.readAsText(file);
			}
		};

		const handleDragOver = (e) => {
			e.preventDefault();
			elDebug.classList.add('is-dragging');
		};

		const handleDragLeave = (e) => {
			e.preventDefault();
			elDebug.classList.remove('is-dragging');
		};

		elDebug.addEventListener('drop', handleDrop);
		elDebug.addEventListener('dragover', handleDragOver);
		elDebug.addEventListener('dragleave', handleDragLeave);
		elDebug.addEventListener('dragend', handleDragLeave);

		return () => {
			elDebug.removeEventListener('drop', handleDrop);
			elDebug.removeEventListener('dragover', handleDragOver);
			elDebug.removeEventListener('dragleave', handleDragLeave);
			elDebug.removeEventListener('dragend', handleDragLeave);
		};
	}, [debug, debugRef, navigate, pagePath, setCurrentLevelId, setLevel, setCustomLevelSvg]);
}

