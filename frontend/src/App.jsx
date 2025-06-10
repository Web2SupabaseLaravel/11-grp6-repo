import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventsPage from './components/abdallah-components/EventsPage';
import EventDetails from './components/abdallah-components/EventDetails';
import LandingPage from './components/abdallah-components/LandingPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/event/:id" element={<EventDetails/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;