import { Routes, Route } from 'react-router-dom';
import { MemoryRouter, HashRouter } from 'react-router-dom';
import { routes } from './routes';
import { Interface } from './components/Interface';
import { Debug } from './components/Debug';
import { useDebugContext } from './context/useContexts';

export default function App() {
  const { debug } = useDebugContext();
  const Router = debug?.router ? HashRouter : MemoryRouter;
  return (
    <div className="sr">
      <div className="sr-stage">
        <div className="sr-typography">
          <Router>
            <Debug />
            <Interface />
            <Routes>
              {routes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Routes>
          </Router>
        </div> 
      </div>
    </div>
  );
}
