import { Navigate } from 'react-router-dom'
import { getToken } from '../utils/api'

export default function ProtectedRoute({ children }) {
  const token = supabase.auth.getSession()
  if (!token) return <Navigate to="/" replace />
  return children
}