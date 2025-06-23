import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

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

import AttendeeList from "./components/amjad-component/AttendeeListComponent.jsx";
import CheckInPage from "./components/amjad-component/CheckInPage.jsx";
import MyRegistrationsPage from "./components/amjad-component/MyRegistrationsPage.jsx";

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
import EventManagementPage from './components/hadi-components/ListEvent.jsx';

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ["/sign-in", "/signup", "/forgot-password", "/reset-code", "/reset-password", "/password-changed"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <div className="App">
        <Routes>
          {/* Abdallah */}
          <Route path="/home" element={<LandingPage />} />
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
          <Route path="/list" element={<AttendeeList />} />
          <Route path="/check-in" element={<CheckInPage />} />
          <Route path="/my-registrations" element={<MyRegistrationsPage />} />

          {/* Qais */}
          <Route path="/create-ticket" element={<CreateTicketPage />} />
          <Route path="/send-email" element={<SendEmailPage />} />
          <Route path="/tickets-inventory" element={<TicketsInventory />} />
          <Route path="/registrants-dashboard" element={<RegistrantsDashboard />} />

          {/* Noor */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/reports-dashboard" element={<ReportsDashboard />} />
          <Route path="/event-approval" element={<EventApproval />} />
          <Route path="/user-management" element={<UserManagement />} />

          {/* Hadi */}
          <Route path="/create-event" element={<EventifyForm />} />
          <Route path="/list-event" element={<EventManagementPage />} />
          <Route path="/edit-event/:id" element={<EditeEvent />} />
          
        </Routes>
      </div>

      {!shouldHideNavbar && <EventlyFooter />}
      </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
