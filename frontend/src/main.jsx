// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';
// import EventsPage from './components/abdallah-components/EventsPage.jsx';
// import MyRegistrationsPage from './components/amjad-component/MyRegistrationsPage.jsx';
// import CheckInPage from './components/amjad-component/CheckInPage.jsx';
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     {/* <EventsPage/> */}
//     <MyRegistrationsPage/>
  
    

//   </StrictMode>,
// )
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);