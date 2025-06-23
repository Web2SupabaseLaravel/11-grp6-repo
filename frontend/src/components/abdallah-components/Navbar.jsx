import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
export default function Navbar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://127.0.0.1:8000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })
      .then(res => {
        setUserName(res.data.name);
      })
      .catch(err => {
        console.error("Error fetching user info:", err);
        setUserName(null);
      });
    } else {
      setUserName(null);
    }
  }, []);
  const handleLogout = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/sign-in");
      return;
    }

    axios.post("http://127.0.0.1:8000/api/logout", {}, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
    .then(() => {
      localStorage.removeItem("token");
      setUserName(null);   
      navigate("/sign-in");
    })
    .catch((error) => {
      console.error("Logout failed", error);
      
      localStorage.removeItem("token");
      setUserName(null);
      navigate("/sign-in");
    });
  };

  
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-4">
        <Link className="navbar-brand d-flex align-items-center ms-5" to="/Home">
          <img 
            src="/assets/MyLogoFree.png" 
            alt="Logo" 
            height="32"
            className="me-2"
          />
        </Link>

        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link fw-medium px-3 py-2 rounded-pill mx-1 text-hover-primary" to="/Home">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link fw-medium px-3 py-2 rounded-pill mx-1 text-hover-primary" to="/events">
                Events
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle fw-medium px-3 py-2 rounded-pill mx-1" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                Add
              </a>
              <ul className="dropdown-menu shadow border-0 mt-2">
                <li>
                <Link className="dropdown-item py-2" to="/create-event">Create Event</Link>
                </li>
                <li>
                <Link className="dropdown-item py-2" to="/list-event">Edit Event</Link>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle fw-medium px-3 py-2 rounded-pill mx-1" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                Manage
              </a>
            <ul className="dropdown-menu shadow border-0 mt-2">
                <li>
                    <Link className="dropdown-item py-2" to="/create-ticket">Create Ticket</Link>
                </li>
                <li>
                    <Link className="dropdown-item py-2" to="/tickets-inventory">Tickets Inventory</Link>
                </li>
                <li>
                    <Link className="dropdown-item py-2" to="/registrants-dashboard">Registeration Dashboard</Link>
                </li>
                <li>
                    <Link className="dropdown-item py-2" to="/send-email">Send Email for Attendees</Link>
                </li>
            </ul>
            
            </li>

            
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle fw-medium px-3 py-2 rounded-pill mx-1" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                Admin
              </a>
              <ul className="dropdown-menu shadow border-0 mt-2">
                <li><Link className="dropdown-item py-2" to="/admin-dashboard">Admin Dashboard</Link></li>
                <li><Link className="dropdown-item py-2" to="/event-approval">Event Approval</Link></li>
                <li><Link className="dropdown-item py-2" to="/reports-dashboard">Reports Dashboard</Link></li>
                <li><Link className="dropdown-item py-2" to="/user-managment">User Management</Link></li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle fw-medium px-3 py-2 rounded-pill mx-1" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                Registerations
              </a>
            <ul className="dropdown-menu shadow border-0 mt-2">
            <li>
                <Link className="dropdown-item py-2" to="/List">Attendee List</Link>
            </li>
            <li>
                <Link className="dropdown-item py-2" to="/check-in">Check in</Link>
            </li>
            <li>
                <Link className="dropdown-item py-2" to="/my-registrations">My Registrations</Link>
            </li> 
            </ul>
            
            </li>
            
            <li className="nav-item ms-3">
                {!userName ? (
          <>
            <ul style={{ display: 'flex', alignItems: 'center', gap: '8px', listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="nav-item">
                <Link 
                  to="/sign-in" 
                  className="btn btn-outline-primary custom-outline rounded-pill px-4 py-2"
                  style={{ borderColor: '#8447E9', color: '#8447E9' }}
                >
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/signup" 
                  className="btn custom-filled rounded-pill px-4 py-2 text-white"
                  style={{ backgroundColor: '#8447E9' }}
                >
                  Sign Up
                </Link> 
              </li>
            </ul>

          </>
        ) : (
          <li className="nav-item dropdown">
            <a 
              className="nav-link dropdown-toggle custom-outline fw-medium px-3 py-2 rounded-2 mx-1" 
              href="#" 
              role="button" 
              data-bs-toggle="dropdown" 
              aria-expanded="false"
              style={{ borderColor: '#8447E9', color: '#8447E9' }}
            >
             {userName}
            </a>
            <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
              <li>
                <button 
                  className="dropdown-item py-2" 
                  onClick={handleLogout}
                  
                >
                  Log out
                </button>
              </li>
            </ul>
          </li>

        )}
            </li>
          </ul>
        </div>
      

      <style jsx>{`
        .text-hover-primary:hover {
          color: #0d6efd !important;
          background-color: rgba(13, 110, 253, 0.1);
        }
        .dropdown-menu {
          border-radius: 0.5rem;
        }
        .dropdown-item:hover {
          background-color: rgba(13, 110, 253, 0.1);
          color: #0d6efd;
        }
            /* Hover for Login button */
        .btn-outline-primary.custom-outline:hover {
            background-color:rgb(236, 224, 255);
            color: white;
            border-color: #8447E9;
        }
      `}</style>
    </nav>
  );
}
