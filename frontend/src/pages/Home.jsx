import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  // Mock user — will come from auth later
  const user = { name: 'Anjan' }

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
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/home')}
          >
            <div className="w-8 h-8 bg-blue-700 rounded-md"></div>
            <span className="text-xl font-bold text-blue-800 tracking-tight">
              CareerCraft AI
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
            <button onClick={() => navigate('/dashboard')} className="hover:text-blue-700 transition">Dashboard</button>
            <button onClick={() => navigate('/resume/new')} className="hover:text-blue-700 transition">Resume</button>
            <button onClick={() => navigate('/cover-letter/new')} className="hover:text-blue-700 transition">Cover Letter</button>
            <button onClick={() => navigate('/ats-score')} className="hover:text-blue-700 transition">ATS Score</button>
            <button onClick={() => navigate('/about')} className="hover:text-blue-700 transition">About Us</button>
          </div>

          {/* User Avatar + Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-9 h-9 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.name.charAt(0)}
              </div>
              <span className="text-sm font-semibold text-gray-700">{user.name}</span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="hidden sm:block px-4 py-2 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
            >
              Logout
            </button>
            {/* Mobile Menu Button */}
            <button
              className="sm:hidden text-gray-600"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="sm:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-3 text-sm font-medium text-gray-600">
            <button onClick={() => navigate('/dashboard')} className="text-left hover:text-blue-700">Dashboard</button>
            <button onClick={() => navigate('/resume/new')} className="text-left hover:text-blue-700">Resume</button>
            <button onClick={() => navigate('/cover-letter/new')} className="text-left hover:text-blue-700">Cover Letter</button>
            <button onClick={() => navigate('/ats-score')} className="text-left hover:text-blue-700">ATS Score</button>
            <button onClick={() => navigate('/about')} className="text-left hover:text-blue-700">About Us</button>
            <button onClick={() => navigate('/')} className="text-left text-red-600">Logout</button>
          </div>
        )}
      </nav>

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
      <footer className="bg-white border-t border-gray-200 py-5 px-6 mt-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-700 rounded"></div>
            <span className="font-semibold text-gray-600">CareerCraft AI</span>
          </div>
          <div className="flex gap-5">
            <button onClick={() => navigate('/about')} className="hover:text-blue-600 transition">About Us</button>
            <button onClick={() => navigate('/dashboard')} className="hover:text-blue-600 transition">Dashboard</button>
            <button onClick={() => navigate('/')} className="hover:text-red-500 transition">Logout</button>
          </div>
          <span>
            © {new Date().getFullYear()} banerjee & co. All rights reserved.
            </span>
        </div>
      </footer>

    </div>
  )
}