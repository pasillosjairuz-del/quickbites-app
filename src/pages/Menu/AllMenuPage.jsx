import { useEffect, useMemo, useState } from 'react'
import MenuCard from '../../components/MenuCard.jsx'
import Pagination from '../../components/Pagination.jsx'
import { supabase } from '../../lib/supabaseClient.js'

const ITEMS_PER_PAGE = 9

export default function AllMenuPage() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(0)

  useEffect(() => {
    let isMounted = true

    async function loadMenuItems() {
      setLoading(true)
      setError('')
      const { data, error: fetchError } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: true })

      if (!isMounted) return
      setLoading(false)

      if (fetchError) {
        setError(fetchError.message)
        return
      }

      setMenuItems(
        data.map((row) => ({
          id: row.id,
          name: row.name,
          price: row.price,
          description: row.description,
          available: row.is_available,
          servingCount: row.serving_count,
        })),
      )
    }

    loadMenuItems()
    return () => {
      isMounted = false
    }
  }, [])

  const pageCount = Math.max(1, Math.ceil(menuItems.length / ITEMS_PER_PAGE))
  const pageItems = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE
    return menuItems.slice(start, start + ITEMS_PER_PAGE)
  }, [menuItems, currentPage])

  return (
    <div className="menu-page">
      <div className="menu-page-header">
        <h1 className="menu-page-title">All Menu</h1>
      </div>

      {error && <p className="auth-error">{error}</p>}

      {loading ? (
        <p className="auth-status">Loading menu...</p>
      ) : (
        <>
          <div className="menu-grid">
            {pageItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
          <Pagination
            pageCount={pageCount}
            currentPage={currentPage}
            onPrev={() => setCurrentPage((page) => Math.max(0, page - 1))}
            onNext={() => setCurrentPage((page) => Math.min(pageCount - 1, page + 1))}
          />
        </>
      )}
    </div>
  )
}
