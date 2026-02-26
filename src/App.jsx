import { Routes, Route } from 'react-router-dom';
import { MemoryRouter, HashRouter } from 'react-router-dom';
import { routes } from './routes';
import { Interface } from './components/Interface';
import { Debug } from './components/Debug';
import { useDebugContext } from './context/useContexts';

/**
 * Root layout: router (Memory or Hash when debug), nav/score Interface, Debug panel, and route outlet.
 *
 * @returns {React.ReactNode} The App component.
 */
export default function App() {
  const { debug } = useDebugContext();
  // HashRouter exposes URL path for debugging (refresh keeps current page)
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
