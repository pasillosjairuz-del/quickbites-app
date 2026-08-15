import { createContext, useContext, useMemo, useState, useCallback } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState({}) // { [menuItemId]: quantity }

  const addItem = useCallback((id) => {
    setItems((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
  }, [])

  const totalCount = useMemo(
    () => Object.values(items).reduce((sum, qty) => sum + qty, 0),
    [items],
  )

  const value = useMemo(() => ({ items, addItem, totalCount }), [items, addItem, totalCount])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
