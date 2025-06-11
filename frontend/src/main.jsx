import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import EventsPage from './components/abdallah-components/EventsPage.jsx';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <App/>

  </StrictMode>,
)
/*
import EditeEvent from './components/hadi-components/EditeEvent.jsx';
import EventifyForm from './components/hadi-components/CreateEvent.jsx';
import EventlyFooter from './components/hadi-components/Footer.jsx';

<EventifyForm/>
<EditeEvent/>
<EventlyFooter/>

*/