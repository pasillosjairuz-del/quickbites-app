import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import '../../styles/login.css'

import greenBg from '../../assets/images/green-background.png'
import jrccLogo from '../../assets/images/jrcc-logo.png'
import quickbitesLogo from '../../assets/images/quickbites-logo.png'
import digInBtnImg from '../../assets/images/dig-in-button.png'

export default function LoginPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    setTimeout(() => {
      setLoading(false)
      navigate('/menu')
    }, 500)
  }

  return (
    <div className="login-page" style={{ backgroundImage: `url(${greenBg})` }}>
      {/* Left Panel - JRCC Crest */}
      <section className="left-panel">
        <img
          src={jrccLogo}
          alt="Jesus Reigns Christian College"
          className="jrcc-logo"
        />
      </section>

      {/* Right Cream Container */}
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
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Forgot Password Route Link */}
            <Link to="/forgot-password" className="forgot-password" id="forgotPassword">
              Forgot Password?
            </Link>

            {/* Yellow DIG IN Button */}
            <button type="submit" className="dig-in-button" disabled={loading}>
              <img src={digInBtnImg} alt="DIG IN" />
            </button>

            {message && (
              <p id="loginMessage" className="login-message" style={{ color: '#d32f2f' }}>
                {message}
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  )
}