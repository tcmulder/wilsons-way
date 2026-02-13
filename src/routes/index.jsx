import IntroPage from './IntroPage';
import LevelPage from './LevelPage';
import Level1OutroPage from './Level1OutroPage';

export const routes = [
  { path: '/', title: 'Intro', element: <IntroPage /> },
  { path: '/gameplay', title: 'Gameplay', element: <LevelPage /> },
  { path: '/outro/1', title: 'Level 1 Outro', element: <Level1OutroPage /> },
];
