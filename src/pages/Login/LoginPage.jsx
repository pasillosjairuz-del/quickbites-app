import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Styles
import '../../styles/components.css';
import '../../styles/login.css';

// Assets
import greenBg from '../../assets/images/green-background.png';
import jrccLogo from '../../assets/images/jrcc-logo.png';
import quickbitesLogo from '../../assets/images/quickbites-logo.png';

export default function LoginPage() {
  const navigate = useNavigate();

  // States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Dig In Button Click Handler
  const handleLogin = (e) => {
    e.preventDefault();
    
    // Basic validation check
    if (!email || !password) {
      setMessage('Please fill in all fields.');
      return;
    }

    setMessage('');
    setLoading(true);

    // Show loading screen for 2 seconds before navigating to /menu
    setTimeout(() => {
      setLoading(false);
      navigate('/menu');
    }, 2000);
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${greenBg})`, position: 'relative' }}>
      
      {/* FULL SCREEN LOADING OVERLAY */}
      {loading && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundImage: `url(${greenBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999,
            gap: '25px'
          }}
        >
          {/* Logo with Thick Dark Green Spinner Ring */}
          <div style={{ position: 'relative', width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div 
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '18px solid #0f3a15',              // Dark base green ring
                borderTop: '18px solid #07220b',           // Darker green spinner segment
                animation: 'spin 1.2s linear infinite'
              }}
            />
            <img 
              src={jrccLogo} 
              alt="JRCC Logo" 
              style={{ 
                width: '184px', 
                height: '184px', 
                objectFit: 'contain', 
                borderRadius: '50%',
                position: 'relative',
                zIndex: 2
              }} 
            />
          </div>

          {/* QuickBites Logo */}
          <img 
            src={quickbitesLogo} 
            alt="QuickBites Logo" 
            style={{ width: '250px', objectFit: 'contain' }} 
          />

          {/* Inline keyframes*/}
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

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

          <form id="loginForm" onSubmit={handleLogin}>
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

            {/* DIG IN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              style={{
                width: '260px',
                padding: '12px 0',
                margin: '15px auto 0',
                display: 'block',
                backgroundColor: isHovered ? '#FFA000' : '#FFC107',
                color: '#000',
                fontSize: '24px',
                fontWeight: '900',
                letterSpacing: '0.5px',
                border: '1.5px solid #000',
                borderRadius: '12px',
                boxShadow: isPressed 
                  ? '0px 2px 6px rgba(0, 0, 0, 0.2)' 
                  : isHovered 
                    ? '0px 8px 20px rgba(0, 0, 0, 0.35)' 
                    : '0px 6px 16px rgba(0, 0, 0, 0.25)',
                transform: isPressed 
                  ? 'translateY(2px)' 
                  : isHovered 
                    ? 'translateY(-2px)' 
                    : 'translateY(0px)',
                transition: 'all 0.15s ease',
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >
              DIG IN
            </button>

            {/* Message Alert */}
            {message && (
              <p id="loginMessage" className="login-message" style={{ color: '#d32f2f', textAlign: 'center', marginTop: '10px' }}>
                {message}
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}