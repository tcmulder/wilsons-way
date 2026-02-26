import { useSettingsContext } from '../context/useContexts';

/**
 * Show current version information
 */
export const Version = () => {
	const { settings } = useSettingsContext();
	const { version } = settings;

	if (!version) return null;

	return <span className="sr-version">v{version}</span>;
};