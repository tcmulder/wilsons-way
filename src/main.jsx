/**
 * Game entry point: mounts the app with context providers into #root.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import { AppProviders } from './context/AppProviders';

import './css/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
