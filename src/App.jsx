import { Routes, Route } from 'react-router-dom';
import IntroPage from './routes/IntroPage';
import LevelPage from './routes/LevelPage';
import { Interface } from './components/Interface';
import { Debug } from './components/Debug';

export default function App() {
  console.log('🏃‍➡️', 'rerender');
  return (
    <>
      <div className="sr">
        <div className="sr-stage">
          <div className="sr-typography">
            <Interface />
            <Routes>
              <Route path="/" element={<IntroPage />} />
              <Route path="/gameplay" element={<LevelPage />} />
            </Routes>
            <Debug />
          </div> 
        </div>
      </div>
    </>
  );
}
