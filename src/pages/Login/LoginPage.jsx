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
      <h1 className="auth-heading">Log In</h1>
      <p className="auth-register-text">
        Don&apos;t have an account?{' '}
        <Link to="/register-user" className="auth-inline-link">
          Register
        </Link>
      </p>
      <form onSubmit={handleSubmit}>
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
        {error && <p className="auth-error">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </Button>
      </form>

    </AuthLayout>
  )
}
