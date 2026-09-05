import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from './LoginPage.jsx'
import { supabase } from '../../lib/supabaseClient.js'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

jest.mock('../../lib/supabaseClient.js', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
    },
  },
}))

function renderPage() {
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders a register link pointing to /register-user', () => {
  renderPage()

  expect(screen.getByRole('link', { name: /register/i })).toHaveAttribute('href', '/register')
})

test('logs in and navigates to /menu on success', async () => {
  supabase.auth.signInWithPassword.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null })
  const user = userEvent.setup()
  renderPage()

  await user.type(screen.getByLabelText(/email/i), 'jane.doe@example.com')
  await user.type(screen.getByLabelText(/^password$/i), 'Password123!')
  await user.click(screen.getByRole('button', { name: /dig in/i }))

  expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
    email: 'jane.doe@example.com',
    password: 'Password123!',
  })
  expect(mockNavigate).toHaveBeenCalledWith('/menu')
})

test('shows the supabase error message on failed login', async () => {
  supabase.auth.signInWithPassword.mockResolvedValue({
    error: { message: 'Invalid login credentials' },
  })
  const user = userEvent.setup()
  renderPage()

  await user.type(screen.getByLabelText(/email/i), 'jane.doe@example.com')
  await user.type(screen.getByLabelText(/^password$/i), 'wrong-password')
  await user.click(screen.getByRole('button', { name: /dig in/i }))

  expect(await screen.findByText('Invalid login credentials')).toBeInTheDocument()
  expect(mockNavigate).not.toHaveBeenCalled()
})
