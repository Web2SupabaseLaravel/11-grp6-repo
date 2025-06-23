// File: frontend/src/components/PasswordChanged.js

import React from 'react';
import { Link } from 'react-router-dom';

const PassChanged = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light text-center">
      <div>
        {/* Image */}
        <div className="mb-5">
          <img
            src="/assets/done.png"
            alt="Password Changed"
            className="mb-3"
            style={{ width: '200px', height: 'auto' }}
          />
        </div>

        {/* Title */}
        <h2 className="h2 fw-bold text-dark mb-4">
          Password Changed
        </h2>

        {/* Description */}
        <p className="text-muted mb-5" style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>
          Your password has been changed successfully.
        </p>

        {/* Button */}
        <div className="d-grid" style={{ width: '280px', margin: '0 auto' }}>
          <Link
            to="/sign-in"
            className="btn btn-lg fw-medium py-3"
            style={{
              backgroundColor: '#8447E9',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PassChanged;
