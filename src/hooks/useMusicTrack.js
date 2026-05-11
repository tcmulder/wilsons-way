import { useEffect } from 'react';

import { useAudioContext } from '../context/useContexts';

/**
 * Sets the active music track on mount. If the track is already loaded, playback continues
 * uninterrupted. Pass one of: 'level-1', 'level-2', 'level-3', 'level-4'.
 */
export function useMusicTrack(trackKey) {
	const { setMusicTrack } = useAudioContext();
	useEffect(() => {
		setMusicTrack(trackKey);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps
}
