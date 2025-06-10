import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const navigate = useNavigate();
    const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' // default role
    });

  const [triggerSubmit, setTriggerSubmit] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // useEffect will react to the button trigger
  useEffect(() => {
    if (!triggerSubmit) return;

    const validateAndSubmit = async () => {
      const { username, email, password, confirmPassword } = formData;

      if (!username || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        setTriggerSubmit(false);
        return;
      }

      const usernameRegex = /^(?!\d)[a-zA-Z0-9_]{3,}$/;
      const hasLetter = /[a-zA-Z]/.test(username);
      if (!usernameRegex.test(username) || !hasLetter) {
        alert('Username must be at least 3 characters, contain at least one letter, and start with a letter or underscore');
        setTriggerSubmit(false);
        return;
      }

      if (password.length < 5) {
        alert('Password must be at least 5 characters');
        setTriggerSubmit(false);
        return;
      }

      if (password !== confirmPassword) {
        alert('Passwords do not match');
        setTriggerSubmit(false);
        return;
      }

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/register', {
            name: username,
            email,
            password,
            role: formData.role,
            password_confirmation: confirmPassword
        });


        console.log('Registered:', response.data);
        alert('Registration successful');
        navigate('/sign-in');
      } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed');
      } finally {
        setTriggerSubmit(false); 
      }
    };

    validateAndSubmit();
  }, [triggerSubmit]);

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row h-100">
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div style={{ maxWidth: '400px', width: '100%' }}>
            <h1 className="h2 fw-bold mb-4">Sign up</h1>

            {/* Username */}
            <div className="mb-3">
              <label className="form-label fw-medium">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="form-control py-3"
                placeholder="Your username"
                style={{ borderRadius: '8px' }}
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-control py-3"
                placeholder="Your email"
                style={{ borderRadius: '8px' }}
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label fw-medium">Create a password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-control py-3"
                placeholder="At least 5 characters"
                style={{ borderRadius: '8px' }}
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="form-label fw-medium">Confirm password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="form-control py-3"
                placeholder="Repeat password"
                style={{ borderRadius: '8px' }}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={() => setTriggerSubmit(true)}
              className="btn w-100 py-3 fw-medium"
              style={{
                backgroundColor: '#8447E9',
                color: 'white',
                borderRadius: '8px'
              }}
            >
              Sign up
            </button>

            <p className="text-center mt-3 text-muted">
              Already have an account?{' '}
              <Link
                to="/sign-in"
                className="text-decoration-none"
                style={{ color: '#8447E9' }}
              >
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <img
            src="/assets/Sign-Up.png"
            alt="Sign up illustration"
            className="img-fluid"
            style={{ maxWidth: '400px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;