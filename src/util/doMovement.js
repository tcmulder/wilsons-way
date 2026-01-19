/**
 * Pause playback
 */
export const doPause = ({timelines, setStatus}) => {
	if (!timelines.length) return;
	timelines.forEach(timeline => timeline.pause());
	setStatus(prev => ({...prev, pause: 'pause'}));
}

/**
 * Play playback
 */
export const doPlay = ({timelines, setStatus}) => {
	if (!timelines.length) return;
	timelines.forEach(timeline => timeline.play());
	setStatus(prev => ({...prev, pause: 'none'}));
}