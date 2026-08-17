import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout.jsx'
import FormField from '../../components/FormField.jsx'
import Button from '../../components/Button.jsx'
import { supabase } from '../../lib/supabaseClient.js'

export default function RegisterUserPage() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('student')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setStatus('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    const fullName = `${firstName} ${lastName}`.trim()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, role } },
    })
    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    if (data.session) {
      navigate('/menu')
      return
    }

    setStatus('Check your email to confirm your account, then log in.')
  }

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <FormField
            id="firstName"
            label="First Name"
            type="text"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="First name"
            required
          />
          <FormField
            id="lastName"
            label="Last Name"
            type="text"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Last name"
            required
          />
        </div>
        <FormField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          required
        />
        <FormField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Confirm password"
          required
        />
        <div className="form-field">
          <label htmlFor="role">I am registering as</label>
          <select id="role" value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="student">Student</option>
            <option value="canteen">Canteen Staff</option>
          </select>
        </div>
        {error && <p className="auth-error">{error}</p>}
        {status && <p className="auth-status">{status}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </form>
      <p className="auth-register-text">
        Already have an account?{' '}
        <Link to="/login" className="auth-inline-link">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
