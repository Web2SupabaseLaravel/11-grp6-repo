import React from "react";
import { Routes, Route, Link } from "react-router-dom";


import CreateTicketPage from "./components/qais-components/CreateTicketPage.jsx";
import SendEmailPage from "./components/qais-components/SendEmailPage.jsx";
import TicketsInventory from "./components/qais-components/Ticketsinventory.jsx";
import AttendeeList from "./components/amjad-component/AttendeeListComponent.jsx";
import CheckInPage from "./components/amjad-component/CheckInPage.jsx";
import MyRegistrationsPage from "./components/amjad-component/MyRegistrationsPage.jsx";

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
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<AttendeeList/>} />
        <Route path="/check-in" element={<CheckInPage/>} />
        <Route path="/my-registrations" element={<MyRegistrationsPage/>} />

        <Route path="/create-ticket" element={<CreateTicketPage />} />
        <Route path="/send-email" element={<SendEmailPage />} />
        <Route path="/tickets-inventory" element={<TicketsInventory />} />
      </Routes>
    </>
  );
};

export default App;
