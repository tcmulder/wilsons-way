import { Routes, Route, Link } from 'react-router-dom';
import IntroPage from './routes/IntroPage';
import LevelPage from './routes/LevelPage';
import { useGameContext } from './context/useGameContext';
import { Debug } from './components/Debug';

export default function App() {
  const { level, setLevel, character, setCharacter } = useGameContext();
  return (
    <>
      <div className="sr">
        <div className="sr-stage">
          <div className="sr-typography">
            <nav className="sr-debug-nav">
              <Link to="/">Home</Link>
              |
              <Link to="/gameplay">About</Link>
              <button onClick={() => setLevel(level - 1)}>Previous Level</button>
              <button onClick={() => setLevel(level + 1)}>Next Level</button>
              <button onClick={() => setCharacter(character - 1)}>Previous Character</button>
              <button onClick={() => setCharacter(character + 1)}>Next Character</button>
            </nav>
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
