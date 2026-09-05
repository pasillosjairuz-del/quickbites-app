import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AllMenuPage from './AllMenuPage.jsx'
import { CartProvider } from '../../context/CartContext.jsx'
import { supabase } from '../../lib/supabaseClient.js'
import { makeThenable } from '../../test/supabaseMock.js'

jest.mock('../../lib/supabaseClient.js', () => ({
  supabase: { from: jest.fn() },
}))

function renderPage() {
  render(
    <MemoryRouter>
      <CartProvider>
        <AllMenuPage />
      </CartProvider>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  jest.clearAllMocks()
})

test('renders menu items returned from supabase', async () => {
  supabase.from.mockReturnValue(
    makeThenable({
      data: [
        {
          id: '1',
          name: 'Pork Adobo',
          price: 70,
          description: 'desc',
          is_available: true,
          serving_count: 5,
        },
      ],
      error: null,
    }),
  )

  renderPage()

  expect(await screen.findByText('Pork Adobo')).toBeInTheDocument()
  expect(screen.queryByText(/showing sample menu items/i)).not.toBeInTheDocument()
})

test('falls back to placeholder items with a banner when supabase is unreachable', async () => {
  supabase.from.mockReturnValue(makeThenable({ data: null, error: { message: 'fetch failed' } }))

  renderPage()

  expect(await screen.findByText(/showing sample menu items/i)).toBeInTheDocument()
  expect(screen.getByText('Pork Adobo')).toBeInTheDocument()
})
