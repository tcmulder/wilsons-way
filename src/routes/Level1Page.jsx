import { useEffect } from 'react';
import { useLevelContext } from '../context/useContexts';
import Level from '../components/Level';

/**
 * Level 1 gameplay page.
 * 
 * @returns {React.ReactNode} The Level1Page component.`
 */
const Level1Page = () => {
	const { setLevel } = useLevelContext();

	useEffect(() => {
		setLevel(1);
	}, [setLevel]);

	return <Level />;
};

export default Level1Page;
