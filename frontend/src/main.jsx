import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import OpeningScreen from './components/Raghad-components/OpeningScreen';
import SignIn from './components/Raghad-components/SignIn';
import SignUp from './components/Raghad-components/SignUp';
import Forgotpass from './components/Raghad-components/Forgotpass';
import ResetCode from './components/Raghad-components/ResetCode';
import Resetpassword from './components/Raghad-components/Resetpassword'; // ✅ الاسم الصحيح
import PassChanged from './components/Raghad-components/PassChanged';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OpeningScreen />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<Forgotpass />} />
        <Route path="/reset-code" element={<ResetCode />} />
        <Route path="/reset-password" element={<Resetpassword />} />
        <Route path="/password-changed" element={<PassChanged />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
