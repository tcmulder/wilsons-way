import { useEffect } from 'react';
import { useDebugContext } from '../context/useContexts';

const CollisionTracker = ({ boardRef }) => {
	const { debug } = useDebugContext();

	console.log('CollisionTracker: boardRef', boardRef?.current);
	// useEffect(() => {
	// }, [boardRef]);

	return null;
};

export default CollisionTracker;