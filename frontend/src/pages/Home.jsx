import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import { getProfile, logout } from '../utils/api'

export default function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState({ name: '', profile_picture_url: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const profile = await getProfile()
        setUser({
          name: profile.name || 'User',
          profile_picture_url: profile.profile_picture_url || '',
        })
      } catch (err) {
        console.error('Failed to load profile', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const quickActions = [
    {
      icon: '📄',
      title: 'Build Resume',
      desc: 'Create a new AI-powered professional resume',
      color: 'bg-blue-50 border-blue-200 hover:border-blue-400',
      iconBg: 'bg-blue-100',
      btnColor: 'bg-blue-700 hover:bg-blue-800',
      route: '/resume/new',
    },
    {
      icon: '✉️',
      title: 'Cover Letter',
      desc: 'Generate a tailored cover letter for any job',
      color: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400',
      iconBg: 'bg-indigo-100',
      btnColor: 'bg-indigo-600 hover:bg-indigo-700',
      route: '/cover-letter/new',
    },
    {
      icon: '🎯',
      title: 'ATS Score',
      desc: 'Check how well your resume matches a job',
      color: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400',
      iconBg: 'bg-yellow-100',
      btnColor: 'bg-yellow-600 hover:bg-yellow-700',
      route: '/ats-score',
    },
    {
      icon: '📊',
      title: 'Dashboard',
      desc: 'View and manage all your saved documents',
      color: 'bg-green-50 border-green-200 hover:border-green-400',
      iconBg: 'bg-green-100',
      btnColor: 'bg-green-600 hover:bg-green-700',
      route: '/dashboard',
    },
  ]

  const stats = [
    { label: 'Resumes Created', value: '0', icon: '📄' },
    { label: 'Cover Letters',   value: '0', icon: '✉️' },
    { label: 'ATS Checks',      value: '0', icon: '🎯' },
    { label: 'Avg ATS Score',   value: 'N/A', icon: '📈' },
  ]

  const tips = [
    { icon: '💡', tip: 'Use keywords from the job description to improve your ATS score.' },
    { icon: '📌', tip: 'Keep your resume to 1 page if you have less than 5 years of experience.' },
    { icon: '✅', tip: 'Quantify achievements — e.g. "Increased sales by 30% in Q2 2025".' },
    { icon: '🎨', tip: 'Use a clean, simple format. Avoid tables and graphics in ATS resumes.' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── NAVBAR ── */}
      <Navbar />

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-2xl text-white px-8 py-8 mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md">
          <div>
            <h1 className="text-2xl font-extrabold mb-1">
              Good afternoon, {user.name}! 👋
            </h1>
            <p className="text-blue-100 text-sm">
              Ready to take your career to the next level? What would you like to do today?
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 px-4 py-3 bg-white/10 rounded-2xl border border-white/20">
            {user.profile_picture_url ? (
              <img
                src={user.profile_picture_url}
                alt={`${user.name} profile`}
                className="w-12 h-12 rounded-full object-cover border border-white/30"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center text-lg font-semibold">
                {user.name.charAt(0)}
              </div>
            )}
            <div className="text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">Your account</p>
              <p className="font-semibold">{user.name}</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/resume/new')}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold rounded-lg text-sm shadow transition whitespace-nowrap"
          >
            + Create New Resume
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-5 flex flex-col gap-1">
              <div className="text-2xl">{stat.icon}</div>
              <div className="text-2xl font-extrabold text-blue-800">{stat.value}</div>
              <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-blue-900 mb-5">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {quickActions.map((action, i) => (
              <div
                key={i}
                className={`bg-white rounded-xl border-2 p-6 transition cursor-pointer ${action.color}`}
                onClick={() => navigate(action.route)}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${action.iconBg}`}>
                  {action.icon}
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-1">{action.title}</h3>
                <p className="text-xs text-gray-500 mb-4">{action.desc}</p>
                <button
                  className={`w-full py-2 text-white text-xs font-bold rounded-lg transition ${action.btnColor}`}
                >
                  Open →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Row — Recent Activity + Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-blue-900 mb-4">Recent Activity</h2>
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="text-5xl mb-3">📂</div>
              <p className="text-sm font-semibold text-gray-600">No activity yet</p>
              <p className="text-xs text-gray-400 mt-1 mb-4">
                Your recently created resumes and cover letters will appear here
              </p>
              <button
                onClick={() => navigate('/resume/new')}
                className="px-5 py-2 bg-blue-700 text-white text-xs font-bold rounded-lg hover:bg-blue-800 transition"
              >
                Create Your First Resume
              </button>
            </div>
          </div>

          {/* Career Tips */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-blue-900 mb-4">💼 Career Tips</h2>
            <div className="flex flex-col gap-3">
              {tips.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100"
                >
                  <span className="text-lg mt-0.5">{item.icon}</span>
                  <p className="text-xs text-gray-700 leading-relaxed">{item.tip}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      {/* ── FOOTER ── */}
       <Footer />
    </div>
  )
}