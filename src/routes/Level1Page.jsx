import { useEffect } from 'react';
import { useLevelContext } from '../context/useContexts';
import Level from '../components/Level';

const Level1Page = () => {
	const { setLevel } = useLevelContext();

	useEffect(() => {
		setLevel(1);
	}, [setLevel]);

	return <Level />;
};

export default Level1Page;
