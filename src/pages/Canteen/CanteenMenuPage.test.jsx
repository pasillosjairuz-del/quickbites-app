import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CanteenMenuPage from './CanteenMenuPage.jsx'
import { supabase } from '../../lib/supabaseClient.js'
import { makeThenable } from '../../test/supabaseMock.js'

jest.mock('../../lib/supabaseClient.js', () => ({
  supabase: { auth: { getUser: jest.fn() }, from: jest.fn() },
}))

function renderPage() {
  render(
    <MemoryRouter>
      <CanteenMenuPage />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('shows a login prompt when no user is signed in', async () => {
  supabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null })

  renderPage()

  expect(await screen.findByText(/need a canteen or admin account/i)).toBeInTheDocument()
})

test('shows a login prompt when the signed-in user is not canteen/admin', async () => {
  supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'u1' } }, error: null })
  supabase.from.mockImplementation((table) => {
    if (table === 'profiles') return makeThenable({ data: { role: 'student' }, error: null })
    return makeThenable({ data: [], error: null })
  })

  renderPage()

  expect(await screen.findByText(/need a canteen or admin account/i)).toBeInTheDocument()
})

test('loads and displays menu items for a canteen user', async () => {
  supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'u1' } }, error: null })
  supabase.from.mockImplementation((table) => {
    if (table === 'profiles') return makeThenable({ data: { role: 'canteen' }, error: null })
    return makeThenable({
      data: [{ id: 'm1', name: 'Pork Adobo', description: 'd', price: 70, serving_count: 5, is_available: true }],
      error: null,
    })
  })

  renderPage()

  expect(await screen.findByText('Pork Adobo')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /add item/i })).toBeEnabled()
})

test('falls back to demo mode with sample items when supabase is unreachable', async () => {
  supabase.auth.getUser.mockRejectedValue(new Error('fetch failed'))

  renderPage()

  expect(await screen.findByText(/supabase isn't reachable/i)).toBeInTheDocument()
  expect(screen.getByRole('button', { name: /add item/i })).toBeDisabled()
})
