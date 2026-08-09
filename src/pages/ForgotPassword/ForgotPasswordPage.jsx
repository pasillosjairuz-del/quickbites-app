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
    <>
    </>
  )
}
