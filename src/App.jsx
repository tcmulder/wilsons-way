import { MemoryRouter, HashRouter } from 'react-router-dom';
import { Interface } from './components/Interface';
import { Debug } from './components/Debug';
import { useDebugContext } from './context/useContexts';
import { AnimatedRoutes } from './components/PageTransition';
import { routes } from "./routes";

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
            <AnimatedRoutes routes={routes} />
          </Router>
        </div> 
      </div>
    </div>
  );
}
