import { useEffect } from 'react';
import { useLevelContext } from '../context/useContexts';
import Level from '../components/Level';

/**
 * Level 3 gameplay page.
 * 
 * @returns {React.ReactNode} The Level3Page component.`
 */
const Level3Page = () => {
	const { setLevel } = useLevelContext();

	useEffect(() => {
		setLevel(3);
	}, [setLevel]);

	return <Level />;
};

export default Level3Page;
