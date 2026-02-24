import { useEffect } from 'react';
import { useLevelContext } from '../context/useContexts';
import Level from '../components/Level';

const Level4Page = () => {
	const { setLevel } = useLevelContext();

	useEffect(() => {
		setLevel(4);
	}, [setLevel]);

	return <Level />;
};

export default Level4Page;
