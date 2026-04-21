import { gsap } from 'gsap';
import { useEffect, useRef } from 'react';

import { Page } from '../components/Page';
import { useScoreContext } from '../context/useContexts';
import { useTimedNavigation } from '../hooks/useTimedNavigation';

import SVGLevel4Transition from '../images/pages/level-4-transition.svg?react';

const TRANSITION_NAV_DELAY_MS = 5000;

/**
 * Level 4 transition: fireworks, then high-score form or leaderboard.
 *
 * @returns {React.ReactNode} The Level4TransitionPage component.
 */
const Level4TransitionPage = () => {
	const svgRef = useRef(null);
	const { timedNavigate } = useTimedNavigation();
	const { score } = useScoreContext();
	const { api } = window.sr;

	// Fireworks (elements live on level-4-transition.svg)
	useEffect(() => {
		const elFireworks = [
			{ selector: '.sr-firework-1', xDir: -1, delay: 1 },
			{ selector: '.sr-firework-2', xDir: 1, delay: 1.5 },
			{ selector: '.sr-firework-3', xDir: -1, delay: 2.5 },
		].map(({ selector, xDir, delay }) => ({
			el: svgRef.current?.querySelector(selector),
			x: `${xDir * 12}%`,
			y: `-${12}%`,
			delay,
		}));

		const timelines = [];
		for (const { el, x, y, delay } of elFireworks) {
			if (!el) continue;
			gsap.set(el, { x: 0, y: 0, scale: 0.8, opacity: 0, transformOrigin: 'center bottom' });
			const tl = gsap
				.timeline({ delay })
				.to(el, { x, y, scale: 1, duration: 1.25, ease: 'power1.out' }, 0)
				.to(el, { opacity: 1, duration: 0.75, ease: 'power1.out' }, '<')
				.to(el, { opacity: 0, duration: 0.25, ease: 'power1.in' }, '<=1');
			timelines.push(tl);
		}
		return () => {
			timelines.forEach((tl) => tl.kill());
		};
	}, []);

	// After fireworks: fetch leaderboard and route to form or leaderboard (logic lives here, not on score page).
	useEffect(() => {
		let cancelled = false;
		const timer = setTimeout(() => {
			fetch(`${api}shelf-runner/v1/leaderboard/`, { cache: 'no-store' })
				.then((resp) => resp.json())
				.then((response) => {
					if (cancelled) return;
					const userScore = score?.reduce((sum, entry) => sum + (Number(entry?.num) || 0), 0) ?? 0;
					const highScores = response.data ?? [];
					const isHighScore = highScores.some((e) => userScore >= e.score);
					timedNavigate({ route: isHighScore ? '/form' : '/leaderboard', delay: 0 });
				})
				.catch((error) => {
					console.error('Error fetching leaderboard:', error);
					if (!cancelled) {
						timedNavigate({ route: '/leaderboard', delay: 0 });
					}
				});
		}, TRANSITION_NAV_DELAY_MS);
		return () => {
			cancelled = true;
			clearTimeout(timer);
		};
	}, [score, api, timedNavigate]);

	return (
		<Page fullWidth={true}>
			<SVGLevel4Transition className="sr-page-image" ref={svgRef} />
		</Page>
	);
};

export default Level4TransitionPage;
