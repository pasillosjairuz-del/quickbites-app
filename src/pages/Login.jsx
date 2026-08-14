import React from 'react';
import './login.css'; 
export default function Login() {
  return (
    <div className="login-page">
      {/* LEFT SIDE */}
      <section className="left-panel">
        <img 
          src="/images/jrcc-logo.png" 
          alt="Jesus Reigns Christian College" 
          className="jrcc-logo" 
        />
      </section>

      {/* RIGHT SIDE */}
      <section className="right-panel">
        <div className="login-card">
          <img 
            src="/images/quickbites-logo.png" 
            alt="QuickBites by JRCC" 
            className="quickbites-logo" 
          />

          <h1>WELCOME BACK</h1>
          <h2>READY TO EAT?</h2>

          <p className="register-text">
            Don't have an account? <a href="#" id="registerLink">REGISTER</a>
          </p>

          <form id="loginForm">
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-box">
                <input 
                  type="email" 
                  id="email" 
                  placeholder="student@jrccmanila.edu.ph" 
                  autoComplete="email" 
                  required 
                />
              </div>
            </div>

            <div className="form-group password-group">
              <label htmlFor="password">Password</label>
              <div className="input-box">
                <input 
                  type="password" 
                  id="password" 
                  placeholder="••••••••••••••••••••••" 
                  autoComplete="current-password" 
                  required 
                />
                <button type="button" className="eye-button" id="togglePassword" aria-label="Show password">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"></path>
                    <circle cx="12" cy="12" r="2.5"></circle>
                  </svg>
                </button>
              </div>
            </div>

            <a href="#" className="forgot-password" id="forgotPassword">
              Forgot Password?
            </a>

            <button type="submit" className="dig-in-button">
              <img src="/images/dig-in-button.png" alt="DIG IN" />
            </button>

            <p id="loginMessage" className="login-message"></p>
          </form>
        </div>
      </section>
    </div>
  );
}