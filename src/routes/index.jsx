import HighScorePage from './HighScorePage';
import IntroPage from './IntroPage';
import LeaderboardPage from './LeaderboardPage';
import Level0Page from './Level0Page';
import Level1IntroPage from './Level1IntroPage';
import Level1OutroPage from './Level1OutroPage';
import Level1Page from './Level1Page';
import Level1ScorePage from './Level1ScorePage';
import Level1TransitionPage from './Level1TransitionPage';
import Level2IntroPage from './Level2IntroPage';
import Level2OutroPage from './Level2OutroPage';
import Level2Page from './Level2Page';
import Level2ScorePage from './Level2ScorePage';
import Level2TransitionPage from './Level2TransitionPage';
import Level3IntroPage from './Level3IntroPage';
import Level3OutroPage from './Level3OutroPage';
import Level3Page from './Level3Page';
import Level3ScorePage from './Level3ScorePage';
import Level3TransitionPage from './Level3TransitionPage';
import Level4IntroPage from './Level4IntroPage';
import Level4OutroPage from './Level4OutroPage';
import Level4Page from './Level4Page';
import Level4ScorePage from './Level4ScorePage';
import Level4TransitionPage from './Level4TransitionPage';
import GameOverPage from './GameOverPage';
import RestartPage from './RestartPage';

/**
 * Route config: debug label (for debug nav), path, and element for the pages of the game.
 */
export const routes = [
  { debug: '🎮 Intro', path: '/', element: <IntroPage /> },

  { debug: '1️⃣ Level 1', path: '/level/1', element: <Level1Page /> },
  { debug: '↳ Level 1 Intro', path: '/level/1/Intro', element: <Level1IntroPage /> },
  { debug: '↳ Level 1 Outro', path: '/level/1/outro', element: <Level1OutroPage /> },
  { debug: '↳ Level 1 Score', path: '/level/1/score', element: <Level1ScorePage /> },
  { debug: '↳ Level 1 Transition', path: '/level/1/transition', element: <Level1TransitionPage /> },

  { debug: '2️⃣ Level 2', path: '/level/2', element: <Level2Page /> },
  { debug: '↳ Level 2 Intro', path: '/level/2/Intro', element: <Level2IntroPage /> },
  { debug: '↳ Level 2 Outro', path: '/level/2/outro', element: <Level2OutroPage /> },
  { debug: '↳ Level 2 Score', path: '/level/2/score', element: <Level2ScorePage /> },
  { debug: '↳ Level 2 Transition', path: '/level/2/transition', element: <Level2TransitionPage /> },

  { debug: '3️⃣ Level 3', path: '/level/3', element: <Level3Page /> },
  { debug: '↳ Level 3 Intro', path: '/level/3/Intro', element: <Level3IntroPage /> },
  { debug: '↳ Level 3 Outro', path: '/level/3/outro', element: <Level3OutroPage /> },
  { debug: '↳ Level 3 Score', path: '/level/3/score', element: <Level3ScorePage /> },
  { debug: '↳ Level 3 Transition', path: '/level/3/transition', element: <Level3TransitionPage /> },

  { debug: '4️⃣ Level 4', path: '/level/4', element: <Level4Page /> },
  { debug: '↳ Level 4 Intro', path: '/level/4/Intro', element: <Level4IntroPage /> },
  { debug: '↳ Level 4 Outro', path: '/level/4/outro', element: <Level4OutroPage /> },
  { debug: '↳ Level 4 Score', path: '/level/4/score', element: <Level4ScorePage /> },
  { debug: '↳ Level 4 Transition', path: '/level/4/transition', element: <Level4TransitionPage /> },

  { debug: '💯 High Score', path: '/form', element: <HighScorePage /> },
  { debug: '🏆 Leaderboard', path: '/leaderboard', element: <LeaderboardPage /> },

  { debug: '💀 Game Over', path: '/game-over', element: <GameOverPage /> },
  { debug: '🔄 Restart', path: '/restart', element: <RestartPage /> },

  { debug: '0️⃣ Level 0', path: '/level/0', element: <Level0Page /> },
];
