import { Routes, Route, Link } from 'react-router-dom';
import IntroPage from './routes/IntroPage';
import BoardPage from './routes/BoardPage';

export default function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link> | <Link to="/gameplay">About</Link>
      </nav>

      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/gameplay" element={<BoardPage />} />
      </Routes>
    </>
  );
}
