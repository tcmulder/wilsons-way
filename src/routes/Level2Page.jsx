import { useEffect } from 'react';
import { useLevelContext } from '../context/useContexts';
import Level from '../components/Level';

/**
 * Level 2 gameplay page.
 * 
 * @returns {React.ReactNode} The Level2Page component.`
 */
const Level2Page = () => {
	const { setLevel } = useLevelContext();

	useEffect(() => {
		setLevel(2);
	}, [setLevel]);

	return <Level />;
};

export default Level2Page;
