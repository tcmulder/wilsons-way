import { Routes, Route, Link } from 'react-router-dom';
import IntroPage from './routes/IntroPage';
import BoardPage from './routes/BoardPage';
import { useGameContext } from './context/useGameContext';

export default function App() {
  const { level, setLevel } = useGameContext();
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        |
        <Link to="/gameplay">About</Link>
        <button onClick={() => setLevel(level + 1)}>Next Level</button>
      </nav>
      <div className="sr">
        <div className="sr-stage">
          <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/gameplay" element={<BoardPage />} />
          </Routes>
        </div> 
      </div>
    </>
  );
}
