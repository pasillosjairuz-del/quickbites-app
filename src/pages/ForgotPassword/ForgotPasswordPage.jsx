import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../components/AuthLayout.jsx'
import FormField from '../../components/FormField.jsx'
import Button from '../../components/Button.jsx'
import { supabase } from '../../lib/supabaseClient.js'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setStatus('')
    setLoading(true)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })
    setLoading(false)
    if (resetError) {
      setError(resetError.message)
      return
    }
    setStatus('If that email is registered, a reset link is on its way.')
  }

  return (
    <AuthLayout>
      <h1 className="auth-heading">FORGOT PASSWORD</h1>
      <p className="auth-subtext">
        Enter your school email address, and we will send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit}>
        <FormField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="johnmichael@jrccmanila.edu.ph"
          required
        />

        {error && <p className="auth-error">{error}</p>}
        {status && <p className="auth-status">{status}</p>}

        <Button type="submit" variant="gold" disabled={loading}>
          {loading ? 'SENDING…' : 'SEND LINK'}
        </Button>
      </form>

      <p className="auth-footer">
        Remember Password? <Link to="/login" className="auth-link">LOG IN</Link>
      </p>
    </AuthLayout>
  )
}
