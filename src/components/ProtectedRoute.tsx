import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/auth-context'

export default function ProtectedRoute() {
  const { user } = useAuth()

  return user ? <Outlet /> : <Navigate to="/login" replace />
}