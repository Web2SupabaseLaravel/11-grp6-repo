import React from 'react';

const MyRegistrationsPage = () => {
  const registrations = [
    {
      id: 1,
      eventName: 'Event Name',
      date: 'May 15, 2024',
      location: 'NewYork, NY',
      status: 'Confirmed'
    },
    {
      id: 2,
      eventName: 'Event Name',
      date: 'June 20, 2024',
      location: 'Los Angeles, CA',
      status: 'Confirmed'
    },
    {
      id: 3,
      eventName: 'Event Name',
      date: 'July 8, 2024',
      location: 'Chicago, IL',
      status: 'Pending'
    },
    {
      id: 4,
      eventName: 'Event Name',
      date: 'August 12, 2024',
      location: 'San Francisco, CA',
      status: 'Confirmed'
    }
  ];

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Bootstrap CSS */}
      <link 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" 
        rel="stylesheet" 
      />
      
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div className="container-fluid">
          <a className="navbar-brand fw-bold fs-4" href="#" style={{ color: '#6c5ce7' }}>
            evently
          </a>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="navbar-nav ms-auto d-flex flex-row align-items-center gap-3">
              <a className="nav-link text-muted d-none d-lg-block" href="#">Page</a>
              <a className="nav-link text-muted d-none d-lg-block" href="#">Page</a>
              <a className="nav-link text-muted" href="#">Events</a>
              <button className="btn btn-primary btn-sm" style={{ backgroundColor: '#6c5ce7', borderColor: '#6c5ce7' }}>
                Sign Up
              </button>
              <button className="btn btn-outline-primary btn-sm">Log In</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid mt-4">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8 col-xl-6">
            <div className="bg-white rounded-3 shadow-sm p-4">
              <h2 className="mb-4 fw-bold">My Registrations</h2>
              
              {/* Registration Cards */}
              <div className="d-flex flex-column gap-3">
                {registrations.map((registration) => (
                  <div key={registration.id} className="card border-0 shadow-sm">
                    <div className="card-body py-3">
                      <div className="row align-items-center">
                        {/* Event Info */}
                        <div className="col-12 col-md-6">
                          <h6 className="fw-bold mb-1">{registration.eventName}</h6>
                          <p className="text-muted mb-0 small">
                            {registration.date} {registration.location}
                          </p>
                        </div>
                        
                        {/* Status and Actions */}
                        <div className="col-12 col-md-6 mt-2 mt-md-0">
                          <div className="d-flex align-items-center justify-content-md-end gap-2">
                            <span 
                              className={`badge px-3 py-2 ${registration.status === 'Pending' ? 'text-bg-warning' : 'text-bg-success'}`}
                              style={{ fontSize: '0.75rem' }}
                            >
                              {registration.status}
                            </span>
                            <button 
                              className="btn btn-sm text-white fw-medium px-3"
                              style={{ backgroundColor: '#6c5ce7', border: 'none', fontSize: '0.8rem' }}
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-muted mt-5 pb-4">
        <small>© 2025, Evently. All rights reserved.</small>
      </footer>
    </div>
  );
};

export default MyRegistrationsPage;