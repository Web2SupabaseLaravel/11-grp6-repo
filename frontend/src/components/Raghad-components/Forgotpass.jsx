import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Forgotpass = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }
    console.log('Email submitted:', email);
    navigate('/reset-code');

  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
      <div className="row w-100" style={{ maxWidth: '1000px' }}>
        {/* Left Section */}
        <div className="col-lg-6 d-flex flex-column justify-content-center px-4">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-link text-decoration-none text-dark mb-3 p-0"
            style={{ fontSize: '1rem' }}
          >
            <i className="fas fa-chevron-left me-2"></i>
          </button>

          <h2 className="fw-bold mb-3" style={{ fontSize: '1.8rem' }}>
            Forgot password?
          </h2>

          <p className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>
            Don't worry! It happens. Please enter the email associated with your account.
          </p>

          {/* Email Form */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-medium">
              Email address
            </label>
            <input
              type="email"
              className="form-control py-3 px-3"
              id="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ borderRadius: '8px' }}
            />
          </div>

          <button
            onClick={handleSubmit}
            className="btn py-3 fw-medium w-100"
            style={{
              backgroundColor: '#8b5cf6',
              color: 'white',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          >
            Send code
          </button>

          <div className="text-center mt-4">
            <span className="text-muted">Remember password? </span>
            <Link
              to="/sign-in"
              className="fw-medium text-decoration-none"
              style={{ color: '#8b5cf6' }}
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Right Section - Image */}
        <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center">
          <img
            src="/assets/forgot_password.png"
            alt="Forgot Password Illustration"
            className="img-fluid"
            style={{
              maxWidth: '80%',
              height: 'auto'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Forgotpass;
