import React from 'react';

const EventlyFooter = () => {
  return (
    
    <footer className="bg-light py-5">
      
      <div className="container">
        {/* Header Section */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center">
              <div className="mb-3 mb-lg-0">
                <img 
                  src="/assets/logo.png" 
                  alt="Evently Logo" 
                  className="img-fluid"
                  style={{ height: '60px', width: 'auto', maxWidth: '200px' }}
                />
              </div>
              <div className="text-center text-lg-end">
                <h2 className="h4 text-primary mb-2">Manage and grow your events with ease</h2>
                <p className="text-primary mb-0 fs-5">All-in-one platform for event organizers.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="row">
          {/* About Evently */}
          <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
            <h5 className="fw-bold text-dark mb-3">About Evently</h5>
            <p className="text-muted small">
              Evently is your all-in-one platform for planning, promoting, and managing events of any size. From conferences and workshops to private gatherings, we give organizers the tools they need to succeed.
            </p>
            {/* Social Media Icons */}
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-primary text-decoration-none">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-primary text-decoration-none">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-primary text-decoration-none">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.082.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
              <a href="#" className="text-primary text-decoration-none">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599-.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Platform Features */}
          <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
            <h5 className="fw-bold text-dark mb-3">Platform Features</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small hover-link">Event Creation & Management</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small hover-link">Ticketing & Registration</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small hover-link">Attendee Dashboard</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small hover-link">Reporting & Analytics</a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
            <h5 className="fw-bold text-dark mb-3">Support</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small hover-link">Help Center</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small hover-link">Organizer Guide</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small hover-link">Ticket Support</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small hover-link">Contact Us</a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="col-lg-3 col-md-6">
            <h5 className="fw-bold text-dark mb-3">Legal</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small hover-link">Terms of Service</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small hover-link">Privacy Policy</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small hover-link">Refund Policy</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none small hover-link">Accessibility</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="row mt-4 pt-4 border-top">
          <div className="col-12 text-center">
            <p className="text-muted small mb-0">© 2025 Evently. All rights reserved.</p>
          </div>
        </div>
      </div>

      <style>{`
        .hover-link:hover {
          color: #6f42c1 !important;
          transition: color 0.3s ease;
        }
        
        .text-primary {
          color: #6f42c1 !important;
        }
        
        footer {
          background-color: #F5F5F5 !important;
        }
        
        @media (max-width: 768px) {
          .h2 {
            font-size: 1.75rem;
          }
          .h4 {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </footer>
  );
};

export default EventlyFooter;