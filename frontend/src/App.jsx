import React from "react";
import { Routes, Route } from "react-router-dom";

import AttendeeList from "./Components/amjad-component/Attendee List Component.jsx";
import CheckInPage from "./Components/amjad-component/Check in page.jsx";
import MyRegistrations from "./Components/amjad-component/My Registrations Page.jsx";

import CreateTicketPage from "./components/qais-components/CreateTicketPage.jsx";
import SendEmailPage from "./components/qais-components/SendEmailPage.jsx";
import TicketsInventory from "./components/qais-components/Ticketsinventory.jsx";
import RegistrantsDashboard from "./components/qais-components/RegistrantsDashboard.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<AttendeeList />} />
      <Route path="/check-in" element={<CheckInPage />} />
      <Route path="/my-registrations" element={<MyRegistrations />} />
      <Route path="/create-ticket" element={<CreateTicketPage />} />
      <Route path="/send-email" element={<SendEmailPage />} />
      <Route path="/tickets-inventory" element={<TicketsInventory />} />
      <Route path="/registrants-dashboard" element={<RegistrantsDashboard />} />
    </Routes>
  );
};

export default App;