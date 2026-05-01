import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearToken, getCoverLetters, getProfile, getResumes } from '../utils/api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [resumes, setResumes] = useState([])
  const [coverLetters, setCoverLetters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true)
      setError('')

      try {
        const [profileData, resumeData, coverData] = await Promise.all([
          getProfile(),
          getResumes(),
          getCoverLetters(),
        ])

        setUser({
          name: profileData.name,
          email: profileData.email,
          memberSince: new Date(profileData.memberSince).toLocaleDateString(),
          role: 'Career Customer',
        })
        setResumes(resumeData.resumes || [])
        setCoverLetters(coverData.coverLetters || [])
      } catch (err) {
        const message = err.message || 'Unable to load dashboard data'
        if (message.toLowerCase().includes('authentication') || message.toLowerCase().includes('token')) {
          clearToken()
          navigate('/login')
          return
        }
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [navigate])

  const atsHistory = useMemo(() => {
    return resumes.map((item) => ({
      id: item.id,
      date: item.updated_at || item.created_at || 'Unknown',
      job: item.title,
      score: item.ats_score ?? 0,
    }))
  }, [resumes])

  const handleLogout = () => {
    clearToken()
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-xl text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-700 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-700 font-semibold">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-700"></div>
            <div>
              <p className="text-sm font-semibold text-slate-600">CareerCraft AI</p>
              <p className="text-xs text-slate-400">Personal workspace</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <button
              onClick={() => navigate('/home')}
              className="px-3 py-2 rounded-xl hover:bg-slate-100 transition"
              type="button"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/resume/new')}
              className="px-3 py-2 rounded-xl hover:bg-slate-100 transition"
              type="button"
            >
              Build Resume
            </button>
            <button
              onClick={() => navigate('/cover-letter/new')}
              className="px-3 py-2 rounded-xl hover:bg-slate-100 transition"
              type="button"
            >
              Cover Letter
            </button>
            <button
              onClick={() => navigate('/ats-score')}
              className="px-3 py-2 rounded-xl hover:bg-slate-100 transition"
              type="button"
            >
              ATS Score
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition"
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {error && (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 text-white p-8 shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-300">Dashboard</p>
              <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight">
                Your personal workspace
              </h1>
              <p className="mt-3 max-w-2xl text-slate-200 text-sm leading-6">
                Manage saved resumes, cover letters, ATS results, and account settings from one place.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-md">
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-sm text-slate-300">Resumes</p>
                <p className="mt-2 text-2xl font-semibold">{resumes.length}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-sm text-slate-300">Cover Letters</p>
                <p className="mt-2 text-2xl font-semibold">{coverLetters.length}</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-sm text-slate-300">ATS Checks</p>
                <p className="mt-2 text-2xl font-semibold">{atsHistory.length}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.95fr]">
          <div className="space-y-8">
            <section className="rounded-3xl bg-white shadow-sm border border-slate-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Saved Resumes</h2>
                  <p className="text-sm text-slate-500">Manage resume drafts, download final PDFs, or edit your profile content.</p>
                </div>
                <button
                  onClick={() => navigate('/resume/new')}
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 transition"
                  type="button"
                >
                  + New Resume
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm text-slate-700">
                  <thead className="border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Resume</th>
                      <th className="px-4 py-3">Updated</th>
                      <th className="px-4 py-3">ATS Score</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumes.map((resume) => (
                      <tr key={resume.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                        <td className="px-4 py-4 font-medium text-slate-900">{resume.title}</td>
                        <td className="px-4 py-4 text-slate-500">{resume.updated_at || resume.created_at}</td>
                        <td className="px-4 py-4 text-slate-900">
                          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {resume.ats_score ?? 0}%
                          </span>
                        </td>
                        <td className="px-4 py-4 space-x-2">
                          <button type="button" className="rounded-2xl border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition">Edit</button>
                          <button type="button" className="rounded-2xl border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition">Download</button>
                          <button type="button" className="rounded-2xl border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 transition">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-3xl bg-white shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Saved Cover Letters</h2>
                  <p className="text-sm text-slate-500">Review and manage cover letters tailored for your job applications.</p>
                </div>
                <button
                  onClick={() => navigate('/cover-letter/new')}
                  className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
                  type="button"
                >
                  + New Cover Letter
                </button>
              </div>
              <div className="space-y-4">
                {coverLetters.map((letter) => (
                  <div key={letter.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:flex sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{letter.job_title}</p>
                      <p className="mt-1 text-sm text-slate-500">{letter.company_name}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
                      <span>{letter.created_at}</span>
                      <button type="button" className="rounded-2xl border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:bg-slate-100 transition">Edit</button>
                      <button type="button" className="rounded-2xl border border-slate-200 bg-white px-3 py-1 text-slate-700 hover:bg-slate-100 transition">Download</button>
                      <button type="button" className="rounded-2xl border border-red-200 bg-red-50 px-3 py-1 text-red-700 hover:bg-red-100 transition">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section className="rounded-3xl bg-white shadow-sm border border-slate-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900">ATS Score History</h2>
                <p className="text-sm text-slate-500">Track your past ATS checks and identify which applications performed best.</p>
              </div>
              <div className="space-y-4">
                {atsHistory.map((entry) => (
                  <div key={entry.id} className="rounded-3xl border border-slate-100 p-4 bg-slate-50 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{entry.job}</p>
                      <p className="text-sm text-slate-500">{entry.date}</p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-900 border border-slate-200">
                      <span>Score</span>
                      <span className="text-blue-700">{entry.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl bg-white shadow-sm border border-slate-200 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Account & Profile</h2>
                <p className="text-sm text-slate-500">Review your profile details and account preferences.</p>
              </div>
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-5 space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Name</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">{user.name}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Email</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">{user.email}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Member since</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">{user.memberSince}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Account type</p>
                    <p className="mt-1 text-base font-semibold text-slate-900">{user.role}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button type="button" className="w-full rounded-2xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition">Update Profile</button>
                  <button type="button" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">Change Password</button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
