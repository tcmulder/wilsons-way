import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { GameContextProvider } from './context/GameContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GameContextProvider>
      <MemoryRouter>
        <App />
      </MemoryRouter>
    </GameContextProvider>
  </StrictMode>,
)
