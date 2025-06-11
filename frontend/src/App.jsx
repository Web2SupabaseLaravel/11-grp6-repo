import React from "react";
import { Routes, Route, Link } from "react-router-dom";

import AttendeeList from "./Components/amjad-component/Attendee List Component.jsx";
import CheckInPage from "./Components/amjad-component/Check in page.jsx";
import MyRegistrations from "./Components/amjad-component/My Registrations Page.jsx";

import CreateTicketPage from "./components/qais-components/CreateTicketPage.jsx";
import SendEmailPage from "./components/qais-components/SendEmailPage.jsx";
import TicketsInventory from "./components/qais-components/Ticketsinventory.jsx";

import AdminDashboard from "./components/noor-components/AdminDashboard.jsx";
import ReportsDashboard from "./components/noor-components/ReportsDashboard.jsx";
import EventApproval from "./components/noor-components/EventApproval.jsx";
import UserManagement from "./components/noor-components/UserManagement.jsx";

const App = () => {
  return (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/check-in">Check-In</Link>
          <Link to="/my-registrations">My Registrations</Link>
          <Link to="/create-ticket">Create Ticket</Link>
          <Link to="/send-email">Send Email</Link>
          <Link to="/tickets-inventory">Tickets Inventory</Link>

          <Link to="/admin-dashboard">Admin Dashboard</Link>
          <Link to="/reports-dashboard">Reports Dashboard</Link>
          <Link to="/event-approval">Event Approval</Link>
          <Link to="user-managment">User Management</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<AttendeeList />} />
        <Route path="/check-in" element={<CheckInPage />} />
        <Route path="/my-registrations" element={<MyRegistrations />} />

        <Route path="/create-ticket" element={<CreateTicketPage />} />
        <Route path="/send-email" element={<SendEmailPage />} />
        <Route path="/tickets-inventory" element={<TicketsInventory />} />

        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/reports-dashboard" element={<ReportsDashboard />} />
        <Route path="/event-approval" element={<EventApproval />} />
        <Route path="user-managment" element={<UserManagement />} />
      </Routes>
    </>
  );
};

export default App;