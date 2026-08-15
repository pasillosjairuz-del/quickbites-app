import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Styles
import '/src/styles/login.css';

// Assets
import greenBg from '../../assets/images/green-background.png';
import jrccLogo from '../../assets/images/jrcc-logo.png';
import quickbitesLogo from '../../assets/images/quickbites-logo.png';
import digInBtnImg from '../../assets/images/dig-in-button.png';

export default function LoginPage() {
  const navigate = useNavigate();

  // States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate('/menu');
    }, 500);
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${greenBg})` }}>
      {/* LEFT PANEL */}
      <section className="left-panel">
        <img
          src={jrccLogo}
          alt="Jesus Reigns Christian College"
          className="jrcc-logo"
        />
      </section>

      {/* RIGHT CREAM PANEL */}
      <section className="right-panel">
        <div className="login-card">
          <img
            src={quickbitesLogo}
            alt="QuickBites by JRCC"
            className="quickbites-logo"
          />

          <h1>WELCOME BACK</h1>
          <h2>READY TO EAT?</h2>

          <p className="register-text">
            Don't have an account?{' '}
            <Link to="/register" id="registerLink">
              REGISTER
            </Link>
          </p>

          <form id="loginForm" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-box">
                <input
                  type="email"
                  id="email"
                  placeholder="student@jrccmanila.edu.ph"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group password-group">
              <label htmlFor="password">Password</label>
              <div className="input-box">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="••••••••••••••••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-button"
                  id="togglePassword"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <svg viewBox="0 0 24 24">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <Link to="/forgot-password" className="forgot-password" id="forgotPassword">
              Forgot Password?
            </Link>

            {/* DIG IN Button Image */}
            <button type="submit" className="dig-in-button" disabled={loading}>
              <img src={digInBtnImg} alt="DIG IN" />
            </button>

            {/* Message Alert */}
            {message && (
              <p id="loginMessage" className="login-message" style={{ color: '#d32f2f' }}>
                {message}
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}