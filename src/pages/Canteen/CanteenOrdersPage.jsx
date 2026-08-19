import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/Button.jsx'
import { supabase } from '../../lib/supabaseClient.js'

export default function CanteenOrdersPage() {
  const [authorized, setAuthorized] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [completingId, setCompletingId] = useState(null)

  useEffect(() => {
    checkAccessAndLoad()
  }, [])

  async function checkAccessAndLoad() {
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setAuthorized(false)
      setLoading(false)
      return
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || !['canteen', 'admin'].includes(profile.role)) {
      setAuthorized(false)
      setLoading(false)
      return
    }

    setAuthorized(true)
    await loadOrders()
  }

  async function loadOrders() {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('orders')
      .select('*, order_items(quantity, unit_price, menu_items(name))')
      .neq('status', 'completed')
      .neq('status', 'cancelled')
      .order('created_at', { ascending: true })
    setLoading(false)

    if (fetchError) {
      setError(fetchError.message)
      return
    }
    setOrders(data)
  }

  async function handleMarkPickedUp(orderId) {
    setError('')
    setCompletingId(orderId)
    const { error: updateError } = await supabase
      .from('orders')
      .update({ status: 'completed' })
      .eq('id', orderId)
    setCompletingId(null)

    if (updateError) {
      setError(updateError.message)
      return
    }
    setOrders((prev) => prev.filter((order) => order.id !== orderId))
  }

  if (authorized === null) {
    return (
      <div className="canteen-page">
        <p className="auth-status">Checking access...</p>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div className="canteen-page">
        <p className="auth-error">You need a canteen or admin account to view orders.</p>
        <p className="auth-register-text">
          <Link to="/login" className="auth-inline-link">
            Log in
          </Link>{' '}
          with a canteen account to continue.
        </p>
      </div>
    )
  }

  return (
    <div className="canteen-page">
      <div className="canteen-page-header">
        <h1 className="menu-page-title">Orders</h1>
        <Link to="/canteen-menu" className="auth-inline-link">
          Manage Menu
        </Link>
      </div>

      {error && <p className="auth-error">{error}</p>}

      {loading ? (
        <p className="auth-status">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="auth-status">No orders waiting for pickup.</p>
      ) : (
        <div className="canteen-list">
          {orders.map((order) => (
            <div key={order.id} className="canteen-item canteen-order-item">
              <div className="canteen-item-info">
                <p className="canteen-item-name">
                  Order #{order.id.slice(0, 8)} — ₱{order.total_amount}
                </p>
                <p className="canteen-item-meta">Status: {order.status}</p>
                <ul className="canteen-order-lines">
                  {order.order_items.map((line, index) => (
                    <li key={index}>
                      {line.quantity}× {line.menu_items?.name ?? 'Unknown item'} (₱{line.unit_price} each)
                    </li>
                  ))}
                </ul>
                {order.special_instructions && (
                  <p className="canteen-item-meta">Note: {order.special_instructions}</p>
                )}
              </div>
              <div className="canteen-item-actions">
                <Button
                  variant="gold"
                  disabled={completingId === order.id}
                  onClick={() => handleMarkPickedUp(order.id)}
                >
                  {completingId === order.id ? 'Marking...' : 'Mark Picked Up'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
