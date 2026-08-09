import { StrictMode } from 'react'
import { createRoot } from 'react'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import MenuManagement from './MenuManagement.jsx'
import './styles/theme.css'
import './styles/global.css'
import './styles/components.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)