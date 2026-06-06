import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, getToken, logout, supabase } from '../utils/api'

const links = [
  { label: 'Home', to: '/home', authOnly: true },
  { label: 'Dashboard', to: '/dashboard', authOnly: true },
  { label: 'Resume', to: '/resume/new', authOnly: true },
  { label: 'Cover Letter', to: '/cover-letter/new', authOnly: true },
  { label: 'ATS Score', to: '/ats-score', authOnly: true },
]

export default function Navbar() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [profile, setProfile] = useState(null)
  const [loadingProfile, setLoadingProfile] = useState(true)

  const token = getToken()
  const isAuthenticated = Boolean(token)
  const homePath = isAuthenticated ? '/home' : '/'

  useEffect(() => {
    let mounted = true

    const loadProfile = async () => {
      setLoadingProfile(true)
      if (!token) {
        if (mounted) {
          setProfile(null)
          setLoadingProfile(false)
        }
        return
      }

      try {
        const data = await getProfile()
        if (!mounted) return
        setProfile({
          name: data.name || 'User',
          profile_picture_url: data.profile_picture_url || '',
        })
      } catch (err) {
        if (!mounted) return
        setProfile(null)
      } finally {
        if (mounted) setLoadingProfile(false)
      }
    }

    loadProfile()

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        loadProfile()
      } else {
        if (mounted) {
          setProfile(null)
          setLoadingProfile(false)
        }
      }
    })

    return () => {
      mounted = false
      authListener?.subscription?.unsubscribe?.()
    }
  }, [token])

  const handleLogout = async () => {
    await logout()
    setProfile(null)
    navigate('/')
  }

  const handleNavigate = (path) => {
    setMenuOpen(false)
    navigate(path)
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => handleNavigate(homePath)}
        >
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-red-500 bg-red-50 shadow-sm">
            <img
              src="/brand%20logo.png"
              alt="CareerCraft AI logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="text-lg font-bold text-blue-800">CareerCraft AI</div>
            <div className="text-xs tracking-tight text-slate-500">Career tools for professionals</div>
          </div>
        </div>

        <div className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-600 xl:ml-auto">
          {links
            .filter((link) => (link.authOnly ? isAuthenticated : true))
            .map((link) => (
              <button
                key={link.to}
                onClick={() => handleNavigate(link.to)}
                className="hover:text-blue-700 transition"
              >
                {link.label}
              </button>
            ))}
        </div>

        <div className="flex items-center gap-3 ml-auto xl:ml-0">
          {isAuthenticated ? (
            <>
              <button
                onClick={handleLogout}
                className="hidden lg:inline-flex items-center px-4 py-2 text-sm font-semibold text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
              >
                Logout
              </button>
              <button
                onClick={() => handleNavigate('/dashboard')}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 hover:bg-slate-100 transition"
              >
                {profile?.profile_picture_url ? (
                  <img
                    src={profile.profile_picture_url}
                    alt={`${profile.name} profile`}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-700 text-white font-semibold flex items-center justify-center text-sm">
                    {profile?.name?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="hidden lg:inline-block text-sm font-medium text-slate-700">
                  {profile?.name || 'User'}
                </span>
              </button>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => handleNavigate('/login')}
                className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition"
              >
                Login
              </button>
              <button
                onClick={() => handleNavigate('/register')}
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition"
              >
                Register
              </button>
            </div>
          )}

          <button
            className="xl:hidden inline-flex items-center justify-center p-2 text-slate-600 rounded-lg border border-slate-200 hover:bg-slate-100 transition"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="xl:hidden bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex flex-col gap-3">
            {links
              .filter((link) => (link.authOnly ? isAuthenticated : true))
              .map((link) => (
                <button
                  key={link.to}
                  onClick={() => handleNavigate(link.to)}
                  className="w-full text-left text-sm font-medium text-slate-700 hover:text-blue-700 transition"
                >
                  {link.label}
                </button>
              ))}
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm font-semibold text-blue-700 hover:text-blue-900 transition"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleNavigate('/login')}
                  className="w-full text-left text-sm font-medium text-slate-700 hover:text-blue-700 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigate('/register')}
                  className="w-full text-left text-sm font-semibold text-blue-700 hover:text-blue-900 transition"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
