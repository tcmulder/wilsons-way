import { Routes, Route } from 'react-router-dom';
import { MemoryRouter, HashRouter } from 'react-router-dom';
import IntroPage from './routes/IntroPage';
import LevelPage from './routes/LevelPage';
import { Interface } from './components/Interface';
import { Debug } from './components/Debug';
import { useDebugContext } from './context/useContexts';

export default function App() {
  const { debug } = useDebugContext();
  const Router = debug?.router === '1' ? HashRouter : MemoryRouter;
  return (
    <div className="sr">
      <div className="sr-stage">
        <div className="sr-typography">
          <Router>
            <Debug />
            <Interface />
            <Routes>
              <Route path="/" element={<IntroPage />} />
              <Route path="/gameplay" element={<LevelPage />} />
            </Routes>
          </Router>
        </div> 
      </div>
    </div>
  );
}
