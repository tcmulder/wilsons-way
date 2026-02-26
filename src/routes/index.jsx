import IntroPage from './IntroPage';
import Level0Page from './Level0Page';
import Level1Page from './Level1Page';
import Level2Page from './Level2Page';
import Level3Page from './Level3Page';
import Level4Page from './Level4Page';
import Level1OutroPage from './Level1OutroPage';
import Level2OutroPage from './Level2OutroPage';
import Level3OutroPage from './Level3OutroPage';
import Level4OutroPage from './Level4OutroPage';
import HighScorePage from './HighScorePage';
import LeaderboardPage from './LeaderboardPage';

/**
 * Route config: path, title (for debug nav), and element for the pages of the game.
 */
export const routes = [
  { path: '/', title: 'Intro', element: <IntroPage /> },
  { path: '/level/0', title: 'Level 0', element: <Level0Page /> },
  { path: '/level/1', title: 'Level 1', element: <Level1Page /> },
  { path: '/level/2', title: 'Level 2', element: <Level2Page /> },
  { path: '/level/3', title: 'Level 3', element: <Level3Page /> },
  { path: '/level/4', title: 'Level 4', element: <Level4Page /> },
  { path: '/outro/1', title: 'Level 1 Outro', element: <Level1OutroPage /> },
  { path: '/outro/2', title: 'Level 2 Outro', element: <Level2OutroPage /> },
  { path: '/outro/3', title: 'Level 3 Outro', element: <Level3OutroPage /> },
  { path: '/outro/4', title: 'Level 4 Outro', element: <Level4OutroPage /> },
  { path: '/form', title: 'High Score', element: <HighScorePage /> },
  { path: '/leaderboard', title: 'Leaderboard', element: <LeaderboardPage /> },
];
