import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      alert('Please fill out both password fields.');
      return;
    }

    if (password.length < 5) {
      alert('Password must be at least 5 characters.');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    alert('Password reset successful!');
    navigate('/password-changed');
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row h-100">
        {/* Left Side - Form */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div style={{ maxWidth: '400px', width: '100%' }}>
            <div className="text-center mb-4">
              <h2 style={{ fontWeight: 'bold' }}>Reset Password</h2>
            </div>

            <form onSubmit={handleSubmit}>
              {/* New Password */}
              <div className="mb-3">
                <label className="form-label fw-medium">New Password</label>
                <input
                  type="password"
                  className="form-control py-3"
                  placeholder="Must be at least 5 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ borderRadius: '8px' }}
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-3">
                <label className="form-label fw-medium">Confirm Password</label>
                <input
                  type="password"
                  className="form-control py-3"
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ borderRadius: '8px' }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn w-100 py-3 fw-medium"
                style={{
                  backgroundColor: '#9b5de5',
                  color: 'white',
                  borderRadius: '8px',
                }}
              >
                Reset Password
              </button>
            </form>

            <div className="mt-3 text-center">
              <span style={{ fontSize: '14px' }}>
                Already have an account?{' '}
                <span
                  style={{ fontWeight: 'bold', cursor: 'pointer', color: '#6f42c1' }}
                  onClick={() => navigate('/sign-in')}
                >
                  Log in
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side - Illustration (hidden on small screens) */}
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center">
          <img
            src="/assets/Reset-password.png"
            alt="Reset Illustration"
            className="img-fluid"
            style={{ maxWidth: '400px' }}
          />
        </div>
      </div>
    </div>
  );
}
