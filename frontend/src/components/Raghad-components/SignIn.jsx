import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in both email and password fields.");
      return;
    }
    if (password !== "123456") {
      alert("Incorrect password. Please try again.");
      return;
    }
    console.log("Signing in with:", { email, password });
  };

  return (
    <div className="container-fluid vh-100 p-0">
      <div className="row h-100">
        {/* Left Side - Form */}
        <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
          <div style={{ maxWidth: "400px", width: "100%" }}>
            {/* Logo */}
            <div className="text-center mb-4">
              <img
                src="/assets/logo.png"
                alt="Logo"
                style={{ width: "120px" }}
              />
            </div>

            {/* Tabs */}
            <div className="d-flex mb-4 w-100 justify-content-center">
              <button
                type="button"
                className="btn fw-bold"
                style={{
                  flex: 1,
                  backgroundColor: "#ffffff",
                  border: "1px solid #e0e0e0",
                  borderRight: "none",
                  borderRadius: "8px 0 0 8px",
                }}
              >
                Sign In
              </button>
              <Link
                to="/signup"
                className="btn fw-bold text-decoration-none"
                style={{
                  flex: 1,
                  backgroundColor: "#f0f0f0",
                  border: "1px solid #e0e0e0",
                  borderRadius: "0 8px 8px 0",
                  color: "#000",
                  textAlign: "center",
                }}
              >
                Register
              </Link>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="mb-3">
                <label className="form-label fw-medium">Email address</label>
                <input
                  type="email"
                  className="form-control py-3"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ borderRadius: "8px" }}
                />
              </div>

              {/* Password Field */}
              <div className="mb-3">
                <label className="form-label fw-medium">Password</label>
                <input
                  type="password"
                  className="form-control py-3"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ borderRadius: "8px" }}
                />
              </div>

              {/* Forgot Password */}
              <div className="mb-3 text-start">
                <Link
                  to="/forgot-password"
                  style={{
                    fontSize: "0.9em",
                    textDecoration: "none",
                    color: "#8447E9",
                  }}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn w-100 py-3 fw-medium"
                style={{
                  backgroundColor: "#8447E9",
                  color: "white",
                  borderRadius: "8px",
                }}
              >
                Sign in
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Illustration (Hidden on small screens) */}
        <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center">
          <img
            src="/assets/login-password.png"
            alt="Login illustration"
            className="img-fluid"
            style={{ maxWidth: "400px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
