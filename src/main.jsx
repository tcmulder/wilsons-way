import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import './css/global.css'
import App from './App.jsx'
import { AppProviders } from './context/AppProviders'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppProviders>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </AppProviders>
  </StrictMode>,
)
