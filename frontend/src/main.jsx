import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import EventsPage from './components/abdallah-components/EventsPage.jsx';
import App from './App.jsx';
import Navbar from './components/abdallah-components/Navbar.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navbar/>
    <App/>

  </StrictMode>,
)
