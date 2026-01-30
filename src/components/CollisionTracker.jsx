import { useEffect } from 'react';
import { useElsContext } from '../context/useContexts';

const CollisionTracker = ({ boardRef }) => {
	const { setEls } = useElsContext();

	console.log('DEBUG: rendered');

	useEffect(() => {
		if (boardRef?.current) {
			setEls(prev => ({ ...prev, elBoard: boardRef.current }));
		}
	}, [boardRef, setEls]);

	return null;
};

export default CollisionTracker;