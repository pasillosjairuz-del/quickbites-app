import { supabase } from './lib/supabaseClient.js'

document.addEventListener('DOMContentLoaded', () => {
  const studentOrderButton = document.querySelector('#student-order-btn')
  const merchantDashboardButton = document.querySelector('#merchant-dashboard-btn')
  const statusElement = document.querySelector('#app-status')

  studentOrderButton?.addEventListener('click', () => {
    alert('Student Order Flow Coming Soon!')
  })

  merchantDashboardButton?.addEventListener('click', () => {
    alert('Merchant Portal Coming Soon!')
  })

  if (statusElement) {
    statusElement.textContent = 'Ready to develop with Vite and Supabase.'
  }

  // Keep the Supabase client available for the app.
  console.debug('Supabase client ready:', supabase)
})
