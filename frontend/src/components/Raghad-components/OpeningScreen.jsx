import React from 'react';
import { Link } from 'react-router-dom';

const OpeningScreen = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light text-center">
      <div>
        {/* Logo */}
        <div className="mb-5">
          <img
            src="/assets/logo.png"
            alt="Evently Logo"
            className="mb-3"
            style={{ width: '200px', height: 'auto' }}
          />
        </div>
        
        {/* Title */}
        <h2 className="h2 fw-bold text-dark mb-4">
          Explore the website
        </h2>
        
        {/* Description */}
        <p className="text-muted mb-5" style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>
          Everything you need to plan and manage<br />
          events, all in one place.
        </p>
        
        {/* Buttons */}
        <div className="d-grid gap-3" style={{ width: '280px', margin: '0 auto' }}>
          <Link
            to="/sign-in"
            className="btn btn-lg fw-medium py-3"
            style={{ 
              backgroundColor: '#8447E9', 
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          >
            Sign In
          </Link>
          <Link 
            to="/signup" 
            className="btn btn-outline-secondary btn-lg fw-medium py-3"
            style={{ 
              borderRadius: '8px',
              borderWidth: '2px',
              fontSize: '1rem',
              color: '#333',
              borderColor: '#ddd'
            }}
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OpeningScreen;
