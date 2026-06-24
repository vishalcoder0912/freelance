/*
 * main.tsx - Application entry point for the React school management system.
 * Bootstraps the React app into the DOM with StrictMode enabled.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './App'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
