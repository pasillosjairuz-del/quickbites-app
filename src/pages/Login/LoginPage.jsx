import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout.jsx'
import FormField from '../../components/FormField.jsx'
import Button from '../../components/Button.jsx'
import { supabase } from '../../lib/supabaseClient.js'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (signInError) {
      setError(signInError.message)
      return
    }
    navigate('/menu')
  }

  return (
    <AuthLayout>
      <h1 className="auth-heading">WELCOME BACK</h1>
      <p className="auth-subheading">READY TO EAT?</p>
      <p className="auth-register-text">
        Don't have an account? <span className="auth-inline-link">REGISTER</span>
      </p>

      <form onSubmit={handleSubmit}>
        <FormField
          id="email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="student@jrccmanila.edu.ph"
          required
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
        <div className="auth-links-row">
          <Link to="/forgot-password" className="auth-link">Forgot Password?</Link>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <Button type="submit" variant="gold" disabled={loading}>
          {loading ? 'SIGNING IN…' : 'DIG IN'}
        </Button>
      </form>
    </AuthLayout>
  )
}
