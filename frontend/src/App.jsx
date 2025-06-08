import React from "react";
import { Routes, Route } from "react-router-dom";
import CreateTicketPage from "./components/qais-components/CreateTicketPage.jsx";
import SendEmailPage from "./components/qais-components/SendEmailPage.jsx";
import TicketsInventory from "./components/qais-components/Ticketsinventory.jsx"; // تم الاستيراد

const App = () => {
  return (
    <Routes>
      <Route path="/create-ticket" element={<CreateTicketPage />} />
      <Route path="/send-email" element={<SendEmailPage />} />
      <Route path="/tickets-inventory" element={<TicketsInventory />} /> {/* تم الإضافة */}
    </Routes>
  );
};

export default App;
