import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase redirect callback
    navigate('/home')
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600">Redirecting...</p>
    </div>
  )
}