import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import EventifyForm from "./components/hadi-components/CreateEvent";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <EventifyForm/>
  </StrictMode>,
)
