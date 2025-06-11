import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/abdallah-components/Navbar'; 
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

import AttendeeList from "./Components/amjad-component/Attendee List Component.jsx";
import CheckInPage from "./Components/amjad-component/Check in page.jsx";
import MyRegistrations from "./Components/amjad-component/My Registrations Page.jsx";

import CreateTicketPage from "./components/qais-components/CreateTicketPage.jsx";
import SendEmailPage from "./components/qais-components/SendEmailPage.jsx";
import TicketsInventory from "./components/qais-components/Ticketsinventory.jsx";
import RegistrantsDashboard from "./components/qais-components/RegistrantsDashboard.jsx";


import AdminDashboard from "./components/noor-components/AdminDashboard.jsx";
import ReportsDashboard from "./components/noor-components/ReportsDashboard.jsx";
import EventApproval from "./components/noor-components/EventApproval.jsx";
import UserManagement from "./components/noor-components/UserManagement.jsx";

import EventifyForm from './components/hadi-components/CreateEvent.jsx';
import EditeEvent from './components/hadi-components/EditeEvent.jsx';
import EventlyFooter from './components/hadi-components/Footer.jsx';

function App() {
  return (
    <Router>
      <Navbar /> {/* ✅ الآن داخل <Router> */}

      <div className="App">
        <Routes>
          {/* Abdallah */}
          <Route path="/Home" element={<LandingPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/event/:id" element={<EventDetails />} />

          {/* Raghad */}
          <Route path="/" element={<OpeningScreen />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<Forgotpass />} />
          <Route path="/reset-code" element={<ResetCode />} />
          <Route path="/reset-password" element={<Resetpassword />} />
          <Route path="/password-changed" element={<PassChanged />} />

          {/* Amjad */}
          <Route path="/List" element={<AttendeeList />} />
          <Route path="/check-in" element={<CheckInPage />} />
          <Route path="/my-registrations" element={<MyRegistrations />} />

          {/* Qais */}
          <Route path="/create-ticket" element={<CreateTicketPage />} />
          <Route path="/send-email" element={<SendEmailPage />} />
          <Route path="/tickets-inventory" element={<TicketsInventory />} />
          <Route path="/registrants-dashboard" element={<RegistrantsDashboard />} />

          {/* Noor */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/reports-dashboard" element={<ReportsDashboard />} />
          <Route path="/event-approval" element={<EventApproval />} />
          <Route path="/user-managment" element={<UserManagement />} />

          {/* Hadi */}
          <Route path="/create-event" element={<EventifyForm />} />
          <Route path="/edit-event" element={<EditeEvent />} />

        </Routes>
      </div>
      <EventlyFooter/>
    </Router>
  );
}

export default App;