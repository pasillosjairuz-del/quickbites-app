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
    <>
    </>
  )
}
