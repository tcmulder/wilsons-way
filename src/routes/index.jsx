import IntroPage from './IntroPage';

import Level1Page from './Level1Page';
import Level1FlagPage from './Level1FlagPage';
import Level1OutroPage from './Level1OutroPage';
import Level1TransitionPage from './Level1TransitionPage';

import Level2Page from './Level2Page';
import Level2FlagPage from './Level2FlagPage';
import Level2OutroPage from './Level2OutroPage';

import Level3Page from './Level3Page';
import Level3FlagPage from './Level3FlagPage';
import Level3OutroPage from './Level3OutroPage';

import Level4Page from './Level4Page';
import Level4FlagPage from './Level4FlagPage';
import Level4OutroPage from './Level4OutroPage';

import HighScorePage from './HighScorePage';
import LeaderboardPage from './LeaderboardPage';

import LostPage from './LostPage';
import RestartPage from './Restart';

import Level0Page from './Level0Page';

/**
 * Route config: path, title (for debug nav), and element for the pages of the game.
 */
export const routes = [
  { path: '/', title: 'Intro', element: <IntroPage /> },

  { path: '/level/1', title: 'Level 1', element: <Level1Page /> },
  { path: '/level/1/flag', title: 'Level 1 Flag', element: <Level1FlagPage /> },
  { path: '/level/1/outro', title: 'Level 1 Outro', element: <Level1OutroPage /> },
  { path: '/level/1/transition', title: 'Level 1 Transition', element: <Level1TransitionPage /> },

  { path: '/level/2', title: 'Level 2', element: <Level2Page /> },
  { path: '/level/2/flag', title: 'Level 2 Flag', element: <Level2FlagPage /> },
  { path: '/level/2/outro', title: 'Level 2 Outro', element: <Level2OutroPage /> },

  { path: '/level/3', title: 'Level 3', element: <Level3Page /> },
  { path: '/level/3/flag', title: 'Level 3 Flag', element: <Level3FlagPage /> },
  { path: '/level/3/outro', title: 'Level 3 Outro', element: <Level3OutroPage /> },

  { path: '/level/4', title: 'Level 4', element: <Level4Page /> },
  { path: '/level/4/flag', title: 'Level 4 Flag', element: <Level4FlagPage /> },
  { path: '/level/4/outro', title: 'Level 4 Outro', element: <Level4OutroPage /> },

  { path: '/form', title: 'High Score', element: <HighScorePage /> },
  { path: '/leaderboard', title: 'Leaderboard', element: <LeaderboardPage /> },

  { path: '/lost', title: 'Lost', element: <LostPage /> },
  { path: '/restart', title: 'Restart', element: <RestartPage /> },

  { path: '/level/0', title: 'Level 0', element: <Level0Page /> },
];
