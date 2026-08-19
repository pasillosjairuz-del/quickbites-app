// Local fallback shown only when the Supabase menu_items fetch fails (e.g. no
// project configured yet). Lets the UI be browsed and clicked through without
// a live backend. Shaped like real menu_items rows so the same mapping code
// handles both. Once Supabase is reachable, real data always wins instead.
export const placeholderMenuItems = [
  {
    id: 'placeholder-pork-adobo',
    name: 'Pork Adobo',
    price: 70,
    description: 'Tender pork simmered in garlic, soy sauce, and vinegar.',
    is_available: true,
    serving_count: 12,
  },
  {
    id: 'placeholder-chicken-curry',
    name: 'Chicken Curry',
    price: 75,
    description: 'Creamy curry with tender chicken and vegetables.',
    is_available: true,
    serving_count: 8,
  },
  {
    id: 'placeholder-beef-caldereta',
    name: 'Beef Caldereta',
    price: 85,
    description: 'Rich tomato-based beef stew with liver sauce.',
    is_available: true,
    serving_count: 5,
  },
  {
    id: 'placeholder-fried-chicken',
    name: 'Fried Chicken',
    price: 65,
    description: 'Crispy golden fried chicken, two pieces.',
    is_available: true,
    serving_count: 20,
  },
  {
    id: 'placeholder-lechon-kawali',
    name: 'Lechon Kawali',
    price: 90,
    description: 'Crispy deep-fried pork belly served with liver sauce.',
    is_available: false,
    serving_count: 0,
  },
  {
    id: 'placeholder-veggie-lumpia',
    name: 'Vegetable Lumpia',
    price: 40,
    description: 'Crispy spring rolls packed with fresh vegetables.',
    is_available: true,
    serving_count: 15,
  },
]

// Simulates place_order() locally when Supabase isn't reachable, so the
// checkout flow can be demoed end-to-end (including stock decreasing)
// without a live backend or a logged-in session. Validates every row before
// applying any change, mirroring the real RPC's all-or-nothing behavior.
// Mutates the module-level array in place, so the effect only lasts for the
// current page session — reload resets the sample stock.
export function placeDemoOrder(cartRows) {
  for (const row of cartRows) {
    const item = placeholderMenuItems.find((candidate) => candidate.id === row.id)
    if (!item || item.serving_count < row.quantity) {
      throw new Error(`Not enough servings available for ${item ? item.name : row.id}`)
    }
  }

  let totalAmount = 0
  for (const row of cartRows) {
    const item = placeholderMenuItems.find((candidate) => candidate.id === row.id)
    item.serving_count -= row.quantity
    item.is_available = item.serving_count > 0
    totalAmount += item.price * row.quantity
  }

  return {
    id: `demo-${Date.now()}`,
    total_amount: totalAmount,
    status: 'pending',
  }
}
