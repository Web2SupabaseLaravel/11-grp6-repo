import { Routes, Route, Link } from 'react-router-dom'
import AttendeeList from './Components/amjad-component/Attendee List Component.jsx'
import CheckInPage from './Components/amjad-component/Check in page.jsx'
import MyRegistrations from './Components/amjad-component/My Registrations Page.jsx'

function App() {
  return (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/check-in">Check-In</Link>
          <Link to="/my-registrations">My Registrations</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<AttendeeList />} />
        <Route path="/check-in" element={<CheckInPage />} />
        <Route path="/my-registrations" element={<MyRegistrations />} />
      </Routes>
    </>
  )
}

export default App
