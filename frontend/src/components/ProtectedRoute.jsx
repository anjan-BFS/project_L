import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../utils/api'

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    let mounted = true

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      setSession(data.session)
      setLoading(false)
    }

    loadSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setSession(session)
      setLoading(false)
    })

    return () => {
      mounted = false
      authListener?.subscription?.unsubscribe?.()
    }
  }, [])

  if (loading) return null
  if (!session) return <Navigate to="/" replace />
  return children
}