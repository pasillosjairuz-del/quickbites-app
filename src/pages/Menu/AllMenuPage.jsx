import { useMemo, useState } from 'react'
import MenuCard from '../../components/MenuCard.jsx'
import Pagination from '../../components/Pagination.jsx'
import { menuItems } from '../../data/menuItems.js'

const ITEMS_PER_PAGE = 9

export default function AllMenuPage() {
  const [currentPage, setCurrentPage] = useState(0)

  const pageCount = Math.max(1, Math.ceil(menuItems.length / ITEMS_PER_PAGE))
  const pageItems = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE
    return menuItems.slice(start, start + ITEMS_PER_PAGE)
  }, [currentPage])

  return (
    <div className="menu-page">
      <div className="menu-page-header">
        <h1 className="menu-page-title">ALL MENU</h1>
        <button type="button" className="menu-hamburger-btn" aria-label="Open menu navigation">
          ☰
        </button>
      </div>

      <div className="menu-grid">
        {pageItems.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>

      <Pagination
        pageCount={pageCount}
        currentPage={currentPage}
        onPrev={() => setCurrentPage((p) => Math.max(0, p - 1))}
        onNext={() => setCurrentPage((p) => Math.min(pageCount - 1, p + 1))}
      />
    </div>
  )
}
