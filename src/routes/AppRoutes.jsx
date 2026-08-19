import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/Login/LoginPage.jsx'
import ForgotPasswordPage from '../pages/ForgotPassword/ForgotPasswordPage.jsx'
import RegisterUserPage from '../pages/RegisterUser/RegisterUserPage.jsx'
import AllMenuPage from '../pages/Menu/AllMenuPage.jsx'
import CanteenMenuPage from '../pages/Canteen/CanteenMenuPage.jsx'
import CanteenOrdersPage from '../pages/Canteen/CanteenOrdersPage.jsx'
import CheckoutPage from '../pages/Checkout/CheckoutPage.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/register-user" element={<RegisterUserPage />} />
      <Route path="/menu" element={<AllMenuPage />} />
      <Route path="/canteen-menu" element={<CanteenMenuPage />} />
      <Route path="/canteen-orders" element={<CanteenOrdersPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
