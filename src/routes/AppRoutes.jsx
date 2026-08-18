import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/Login/LoginPage.jsx'
import ForgotPasswordPage from '../pages/ForgotPassword/ForgotPasswordPage.jsx'
import AllMenuPage from '../pages/Menu/AllMenuPage.jsx'
import RegisterUserPage from '../pages/RegisterUser/RegisterUserPage.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterUserPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/menu" element={<AllMenuPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}