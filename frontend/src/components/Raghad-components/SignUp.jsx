import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password, confirmPassword } = formData;

    if (!email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password.length < 5) {
      alert('Password must be at least 5 characters');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    console.log('Form submitted:', formData);

    // بإمكانك تضيف كود تسجيل المستخدم هنا، بدون تنقل
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row h-100">
        {/* Left Side - Form */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div style={{ maxWidth: '400px', width: '100%' }}>
            <h1 className="h2 fw-bold mb-4">Sign up</h1>
            
            {/* Email Field */}
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

            {/* Password Field */}
            <div className="mb-3">
              <label className="form-label fw-medium">Create a password</label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-control border-end-0 py-3"
                  placeholder="At least 5 characters"
                  style={{ borderRadius: '8px 0 0 8px' }}
                />
                <button
                  type="button"
                  className="btn bg-white border-start-0"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ borderRadius: '0 8px 8px 0' }}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4">
              <label className="form-label fw-medium">Confirm password</label>
              <div className="input-group">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="form-control border-end-0 py-3"
                  placeholder="Repeat password"
                  style={{ borderRadius: '8px 0 0 8px' }}
                />
                <button
                  type="button"
                  className="btn bg-white border-start-0"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ borderRadius: '0 8px 8px 0' }}
                >
                  <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="btn w-100 py-3 fw-medium"
              style={{ 
                backgroundColor: '#8447E9',  // البنفسجي الجديد
                color: 'white',
                borderRadius: '8px' 
              }}
            >
              Sign up
            </button>

            {/* Login Link */}
            <p className="text-center mt-3 text-muted">
              Already have an account?{' '}
              <Link
                to="/sign-in"
                className="text-decoration-none"
                style={{ color: '#8447E9' }}  // البنفسجي الجديد
              >
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Illustration */}
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
