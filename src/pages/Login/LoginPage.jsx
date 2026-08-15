import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { supabase } from '../../lib/supabaseClient';

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

  // Load Google Font "Righteous" dynamically
  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Righteous&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
  }, []);

  // Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    // Temporary Mock Login (Pang-test ng UI habang naka-comment out ang Supabase)
    setTimeout(() => {
      setLoading(false);
      navigate('/menu');
    }, 500);

    /* Pag may maayos nang .env file, i-uncomment ito at i-uncomment din ang import sa Line 3:
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setMessage(signInError.message);
      return;
    }

    navigate('/menu');
    */
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${greenBg})` }}>
      {/* LEFT SIDE */}
      <section className="left-panel">
        <img
          src={jrccLogo}
          alt="Jesus Reigns Christian College"
          className="jrcc-logo"
        />
      </section>

      {/* RIGHT SIDE */}
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
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6Z" />
                    <circle cx="12" cy="12" r="2.5" />
                    {!showPassword && (
                      <line
                        x1="3"
                        y1="3"
                        x2="21"
                        y2="21"
                        stroke="#111"
                        strokeWidth="2"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <Link to="/forgot-password" className="forgot-password" id="forgotPassword">
              Forgot Password?
            </Link>

            {/* Submit Button */}
            <button type="submit" className="dig-in-button" disabled={loading}>
              <img src={digInBtnImg} alt={loading ? 'LOGGING IN...' : 'DIG IN'} />
            </button>

            {/* Message Alert */}
            <p
              id="loginMessage"
              className="login-message"
              style={{ color: message.includes('Error') || message ? '#d32f2f' : '#2e7d32' }}
            >
              {message}
            </p>
          </form>
        </div>
      </section>
    </div>
  );
}