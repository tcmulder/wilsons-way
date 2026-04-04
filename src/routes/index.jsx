import IntroPage from './IntroPage';

import Level1IntroPage from './Level1IntroPage';
import Level1Page from './Level1Page';
import Level1OutroPage from './Level1OutroPage';
import Level1ScorePage from './Level1ScorePage';
import Level1TransitionPage from './Level1TransitionPage';

import Level2IntroPage from './Level2IntroPage';
import Level2Page from './Level2Page';
import Level2OutroPage from './Level2OutroPage';
import Level2TransitionPage from './Level2TransitionPage';

import Level3IntroPage from './Level3IntroPage';
import Level3Page from './Level3Page';
import Level3OutroPage from './Level3OutroPage';
import Level3ScorePage from './Level3ScorePage';
import Level3TransitionPage from './Level3TransitionPage';

import Level4IntroPage from './Level4IntroPage';
import Level4Page from './Level4Page';
import Level4OutroPage from './Level4OutroPage';
import Level4ScorePage from './Level4ScorePage';
import Level4TransitionPage from './Level4TransitionPage';

import HighScorePage from './HighScorePage';
import LeaderboardPage from './LeaderboardPage';

import LostPage from './LostPage';
import RestartPage from './RestartPage';

import Level0Page from './Level0Page';

/**
 * Route config: path, title (for debug nav), and element for the pages of the game.
 */
export const routes = [
  { path: '/', title: 'Intro', element: <IntroPage /> },

  { path: '/level/1/Intro', title: 'Level 1 Intro', element: <Level1IntroPage /> },
  { path: '/level/1', title: 'Level 1', element: <Level1Page /> },
  { path: '/level/1/outro', title: 'Level 1 Outro', element: <Level1OutroPage /> },
  { path: '/level/1/transition', title: 'Level 1 Transition', element: <Level1TransitionPage /> },
  
  { path: '/level/2/Intro', title: 'Level 2 Intro', element: <Level2IntroPage /> },
  { path: '/level/2', title: 'Level 2', element: <Level2Page /> },
  { path: '/level/2/outro', title: 'Level 2 Outro', element: <Level2OutroPage /> },
  { path: '/level/2/transition', title: 'Level 2 Transition', element: <Level2TransitionPage /> },

  { path: '/level/3/Intro', title: 'Level 3 Intro', element: <Level3IntroPage /> },
  { path: '/level/3', title: 'Level 3', element: <Level3Page /> },
  { path: '/level/3/outro', title: 'Level 3 Outro', element: <Level3OutroPage /> },
  { path: '/level/3/score', title: 'Level 3 Score', element: <Level3ScorePage /> },
  { path: '/level/3/transition', title: 'Level 3 Transition', element: <Level3TransitionPage /> },

  { path: '/level/4/Intro', title: 'Level 4 Intro', element: <Level4IntroPage /> },
  { path: '/level/4', title: 'Level 4', element: <Level4Page /> },
  { path: '/level/4/outro', title: 'Level 4 Outro', element: <Level4OutroPage /> },
  { path: '/level/4/score', title: 'Level 4 Score', element: <Level4ScorePage /> },
  { path: '/level/4/transition', title: 'Level 4 Transition', element: <Level4TransitionPage /> },

  { path: '/form', title: 'High Score', element: <HighScorePage /> },
  { path: '/leaderboard', title: 'Leaderboard', element: <LeaderboardPage /> },

  { path: '/lost', title: 'Lost', element: <LostPage /> },
  { path: '/restart', title: 'Restart', element: <RestartPage /> },

  { path: '/level/0', title: 'Level 0', element: <Level0Page /> },
];
