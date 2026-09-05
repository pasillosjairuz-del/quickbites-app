import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import MenuCard from '../../components/MenuCard.jsx'
import Pagination from '../../components/Pagination.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { supabase } from '../../lib/supabaseClient.js'
import { placeholderMenuItems } from '../../data/placeholderMenuItems.js'
import FilterModal from '../../components/FilterModal.jsx'

const ITEMS_PER_PAGE = 9

function toCardItem(row) {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    description: row.description,
    available: row.is_available,
    servingCount: row.serving_count,
  }
}

export default function AllMenuPage() {
  const { totalCount } = useCart()
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [usingPlaceholder, setUsingPlaceholder] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)

  
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function loadMenuItems() {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: true })

      if (!isMounted) return
      setLoading(false)

      if (fetchError) {
        setUsingPlaceholder(true)
        setMenuItems(placeholderMenuItems.map(toCardItem))
        return
      }

      setUsingPlaceholder(false)
      setMenuItems(data.map(toCardItem))
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
        
        {}
        <button
          onClick={() => setIsFilterOpen(true)}
          className="bg-[#1C6400] text-white px-4 py-2 rounded-md font-bold hover:bg-emerald-800 transition"
        >
          Filter 🔍
        </button>

        {totalCount > 0 && (
          <Link to="/checkout" className="cart-summary-link">
            🛒 {totalCount} item{totalCount > 1 ? 's' : ''} — Checkout
          </Link>
        )}
      </div>

      {usingPlaceholder && (
        <p className="auth-status">
          Showing sample menu items — Supabase isn't reachable, so this is placeholder data.
        </p>
      )}

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

      {}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
    </div>
  )
}