import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventsPage from './components/abdallah-components/EventsPage';
import EventDetails from './components/abdallah-components/EventDetails';
import LandingPage from './components/abdallah-components/LandingPage';
import OpeningScreen from './components/Raghad-components/OpeningScreen';
import SignIn from './components/Raghad-components/SignIn';
import SignUp from './components/Raghad-components/SignUp';
import Forgotpass from './components/Raghad-components/Forgotpass';
import ResetCode from './components/Raghad-components/ResetCode';
import Resetpassword from './components/Raghad-components/Resetpassword'; 
import PassChanged from './components/Raghad-components/PassChanged';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/Home" element={<LandingPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/event/:id" element={<EventDetails/>} />
          <Route path="/" element={<OpeningScreen />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<Forgotpass />} />
          <Route path="/reset-code" element={<ResetCode />} />
          <Route path="/reset-password" element={<Resetpassword />} />
          <Route path="/password-changed" element={<PassChanged />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;