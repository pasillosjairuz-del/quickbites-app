import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext.jsx'
import Button from '../../components/Button.jsx'
import { supabase } from '../../lib/supabaseClient.js'

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, updateQuantity, clearCart } = useCart()
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [placingOrder, setPlacingOrder] = useState(false)
  const [confirmedOrder, setConfirmedOrder] = useState(null)

  const cartIds = Object.keys(items)

  useEffect(() => {
    if (cartIds.length === 0) {
      setMenuItems([])
      setLoading(false)
      return
    }

    let isMounted = true
    async function loadCartItems() {
      setLoading(true)
      setError('')
      const { data, error: fetchError } = await supabase
        .from('menu_items')
        .select('*')
        .in('id', cartIds)

      if (!isMounted) return
      setLoading(false)

      if (fetchError) {
        setError(fetchError.message)
        return
      }
      setMenuItems(data)
    }

    loadCartItems()
    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartIds.join(',')])

  const cartRows = menuItems.map((item) => ({
    ...item,
    quantity: items[item.id] ?? 0,
    subtotal: item.price * (items[item.id] ?? 0),
  }))
  const total = cartRows.reduce((sum, row) => sum + row.subtotal, 0)

  async function handlePlaceOrder() {
    setError('')
    setPlacingOrder(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setPlacingOrder(false)
      setError('You need to log in before placing an order.')
      return
    }

    const { data: order, error: placeError } = await supabase.rpc('place_order', {
      cart_items: cartRows.map((row) => ({ menu_item_id: row.id, quantity: row.quantity })),
    })

    setPlacingOrder(false)

    if (placeError) {
      setError(placeError.message)
      const { data: refreshed } = await supabase.from('menu_items').select('*').in('id', cartIds)
      if (refreshed) setMenuItems(refreshed)
      return
    }

    clearCart()
    setConfirmedOrder(order)
  }

  if (confirmedOrder) {
    return (
      <div className="checkout-page">
        <h1 className="menu-page-title">Order Placed</h1>
        <p className="auth-status">
          Your order has been placed for ₱{confirmedOrder.total_amount}. Status: {confirmedOrder.status}.
        </p>
        <Link to="/menu" className="auth-inline-link">
          Back to menu
        </Link>
      </div>
    )
  }

  if (!loading && cartRows.length === 0) {
    return (
      <div className="checkout-page">
        <h1 className="menu-page-title">Checkout</h1>
        <p className="auth-status">Your cart is empty.</p>
        <Link to="/menu" className="auth-inline-link">
          Back to menu
        </Link>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <h1 className="menu-page-title">Checkout</h1>

      {loading ? (
        <p className="auth-status">Loading cart...</p>
      ) : (
        <>
          <div className="checkout-list">
            {cartRows.map((row) => (
              <div key={row.id} className="checkout-item">
                <div className="checkout-item-info">
                  <p className="canteen-item-name">{row.name}</p>
                  <p className="canteen-item-meta">
                    ₱{row.price} × {row.quantity} = ₱{row.subtotal}
                  </p>
                  {row.serving_count < row.quantity && (
                    <p className="auth-error">Only {row.serving_count} left — reduce quantity.</p>
                  )}
                </div>
                <div className="checkout-item-actions">
                  <button
                    type="button"
                    className="pagination-arrow"
                    onClick={() => updateQuantity(row.id, row.quantity - 1)}
                    aria-label={`Decrease ${row.name} quantity`}
                  >
                    −
                  </button>
                  <span>{row.quantity}</span>
                  <button
                    type="button"
                    className="pagination-arrow"
                    onClick={() => updateQuantity(row.id, row.quantity + 1)}
                    aria-label={`Increase ${row.name} quantity`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="checkout-total">Total: ₱{total}</p>
          {error && <p className="auth-error">{error}</p>}

          <Button type="button" disabled={placingOrder} onClick={handlePlaceOrder}>
            {placingOrder ? 'Placing order...' : 'Place Order'}
          </Button>
        </>
      )}
    </div>
  )
}
