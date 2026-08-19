import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FormField from '../../components/FormField.jsx'
import Button from '../../components/Button.jsx'
import { supabase } from '../../lib/supabaseClient.js'

const emptyForm = { name: '', description: '', price: '', servingCount: '' }

export default function CanteenMenuPage() {
  const [authorized, setAuthorized] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(emptyForm)

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
    await loadItems()
  }

  async function loadItems() {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('menu_items')
      .select('*')
      .order('created_at', { ascending: false })
    setLoading(false)

    if (fetchError) {
      setError(fetchError.message)
      return
    }
    setItems(data)
  }

  async function handleAddSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    const { error: insertError } = await supabase.from('menu_items').insert({
      name: form.name,
      description: form.description,
      price: Number(form.price),
      serving_count: Number(form.servingCount),
    })

    setSubmitting(false)
    if (insertError) {
      setError(insertError.message)
      return
    }

    setForm(emptyForm)
    await loadItems()
  }

  function startEdit(item) {
    setEditingId(item.id)
    setEditForm({
      name: item.name,
      description: item.description ?? '',
      price: String(item.price),
      servingCount: String(item.serving_count),
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditForm(emptyForm)
  }

  async function handleEditSave(id) {
    setError('')
    const { error: updateError } = await supabase
      .from('menu_items')
      .update({
        name: editForm.name,
        description: editForm.description,
        price: Number(editForm.price),
        serving_count: Number(editForm.servingCount),
      })
      .eq('id', id)

    if (updateError) {
      setError(updateError.message)
      return
    }

    cancelEdit()
    await loadItems()
  }

  async function handleDelete(id) {
    setError('')
    const { error: deleteError } = await supabase.from('menu_items').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    await loadItems()
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
        <p className="auth-error">You need a canteen or admin account to manage the menu.</p>
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
      <h1 className="menu-page-title">Manage Menu</h1>

      <form className="canteen-form" onSubmit={handleAddSubmit}>
        <FormField
          id="name"
          label="Item Name"
          value={form.name}
          onChange={(event) => setForm((f) => ({ ...f, name: event.target.value }))}
          placeholder="Pork Adobo"
          required
        />
        <FormField
          id="description"
          label="Description"
          value={form.description}
          onChange={(event) => setForm((f) => ({ ...f, description: event.target.value }))}
          placeholder="Short description"
        />
        <FormField
          id="price"
          label="Price"
          type="number"
          value={form.price}
          onChange={(event) => setForm((f) => ({ ...f, price: event.target.value }))}
          placeholder="70"
          required
        />
        <FormField
          id="servingCount"
          label="Servings Today"
          type="number"
          value={form.servingCount}
          onChange={(event) => setForm((f) => ({ ...f, servingCount: event.target.value }))}
          placeholder="50"
          required
        />
        {error && <p className="auth-error">{error}</p>}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Adding...' : 'Add Item'}
        </Button>
      </form>

      <div className="canteen-list">
        {loading ? (
          <p className="auth-status">Loading items...</p>
        ) : items.length === 0 ? (
          <p className="auth-status">No menu items yet.</p>
        ) : (
          items.map((item) =>
            editingId === item.id ? (
              <div key={item.id} className="canteen-item canteen-item-editing">
                <FormField
                  id={`edit-name-${item.id}`}
                  label="Item Name"
                  value={editForm.name}
                  onChange={(event) => setEditForm((f) => ({ ...f, name: event.target.value }))}
                  required
                />
                <FormField
                  id={`edit-description-${item.id}`}
                  label="Description"
                  value={editForm.description}
                  onChange={(event) => setEditForm((f) => ({ ...f, description: event.target.value }))}
                />
                <FormField
                  id={`edit-price-${item.id}`}
                  label="Price"
                  type="number"
                  value={editForm.price}
                  onChange={(event) => setEditForm((f) => ({ ...f, price: event.target.value }))}
                  required
                />
                <FormField
                  id={`edit-servingCount-${item.id}`}
                  label="Servings Today"
                  type="number"
                  value={editForm.servingCount}
                  onChange={(event) => setEditForm((f) => ({ ...f, servingCount: event.target.value }))}
                  required
                />
                <div className="canteen-item-actions">
                  <Button variant="gold" onClick={() => handleEditSave(item.id)}>
                    Save
                  </Button>
                  <Button variant="outline" onClick={cancelEdit}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div key={item.id} className="canteen-item">
                <div className="canteen-item-info">
                  <p className="canteen-item-name">{item.name}</p>
                  <p className="canteen-item-meta">
                    ₱{item.price} · {item.serving_count} servings ·{' '}
                    {item.is_available ? 'Available' : 'Sold out'}
                  </p>
                </div>
                <div className="canteen-item-actions">
                  <Button variant="outline" onClick={() => startEdit(item)}>
                    Edit
                  </Button>
                  <Button variant="outline" onClick={() => handleDelete(item.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ),
          )
        )}
      </div>
    </div>
  )
}
