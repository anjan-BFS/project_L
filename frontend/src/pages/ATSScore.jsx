import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getATSScore } from '../utils/api'
import Footer from '../components/Footer'

const SCORE_LEVELS = [
  { min: 80, label: 'Excellent Match',  color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200', bar: 'bg-green-500',  icon: '🎯' },
  { min: 60, label: 'Good Match',       color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',  bar: 'bg-blue-500',   icon: '👍' },
  { min: 40, label: 'Fair Match',       color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200',bar: 'bg-yellow-500', icon: '⚠️' },
  { min: 0,  label: 'Needs Improvement',color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-200',   bar: 'bg-red-500',    icon: '❌' },
]

const getLevel = (score) => SCORE_LEVELS.find(l => score >= l.min)

export default function ATSScore() {
  const navigate    = useNavigate()
  const resultRef   = useRef(null)

  const [resumeText,  setResumeText]  = useState('')
  const [jobDesc,     setJobDesc]     = useState('')
  const [loading,     setLoading]     = useState(false)
  const [result,      setResult]      = useState(null)
  const [error,       setError]       = useState('')
  const [activeTab,   setActiveTab]   = useState('paste')
  const [history,     setHistory]     = useState([])

  // ── Handle Check ─────────────────────────────────────────
  const handleCheck = async () => {
    if (!resumeText.trim()) { setError('Please paste your resume text'); return }
    if (!jobDesc.trim())    { setError('Please paste the job description'); return }
    setError('')
    setLoading(true)
    setResult(null)

    try {
      const res = await getATSScore({ resumeText, jobDescription: jobDesc })

      // Parse result — handle both real API and placeholder
      const score   = res.atsScore   ?? res.score   ?? 0
      const summary = res.summary    ?? ''
      const matched = res.matchedKeywords  ?? extractKeywords(resumeText, jobDesc, true)
      const missing = res.missingKeywords  ?? extractKeywords(resumeText, jobDesc, false)
      const suggestions = res.suggestions ?? generateSuggestions(score)

      const resultData = { score, summary, matched, missing, suggestions, date: new Date().toLocaleString() }
      setResult(resultData)
      setHistory(prev => [resultData, ...prev.slice(0, 4)])

      // Scroll to result
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    } catch {
      setError('Failed to check ATS score. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Keyword helpers (client-side fallback) ────────────────
  const extractKeywords = (resume, job, matched) => {
    const stopWords = new Set(['the','and','or','in','at','to','a','an','of','for','with','is','are','be','by','on','as','it','its','this','that','from','have','has'])
    const jobWords = job.toLowerCase().match(/\b[a-z]{3,}\b/g)?.filter(w => !stopWords.has(w)) || []
    const resumeWords = new Set(resume.toLowerCase().match(/\b[a-z]{3,}\b/g) || [])
    const unique = [...new Set(jobWords)]
    return matched
      ? unique.filter(w => resumeWords.has(w)).slice(0, 12)
      : unique.filter(w => !resumeWords.has(w)).slice(0, 12)
  }

  const generateSuggestions = (score) => {
    const all = [
      'Add more keywords from the job description to your resume',
      'Quantify your achievements with numbers and percentages',
      'Use action verbs at the start of bullet points',
      'Ensure your job titles match industry standards',
      'Add a strong professional summary matching the role',
      'Include relevant certifications and tools mentioned in the job',
      'Keep formatting clean — avoid tables, images, and columns',
      'Tailor your skills section to match the job requirements',
    ]
    if (score >= 80) return all.slice(0, 2)
    if (score >= 60) return all.slice(0, 4)
    if (score >= 40) return all.slice(0, 6)
    return all
  }

  const handleReset = () => {
    setResult(null)
    setResumeText('')
    setJobDesc('')
    setError('')
  }

  const level = result ? getLevel(result.score) : null

  // ════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* ── NAVBAR ── */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
            <div className="w-8 h-8 bg-blue-700 rounded-md"></div>
            <span className="text-xl font-bold text-blue-800">CareerCraft AI</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => navigate('/home')}             className="hover:text-blue-700 transition">Home</button>
            <button onClick={() => navigate('/resume/new')}       className="hover:text-blue-700 transition">Resume</button>
            <button onClick={() => navigate('/cover-letter/new')} className="hover:text-blue-700 transition">Cover Letter</button>
            <button onClick={() => navigate('/dashboard')}        className="hover:text-blue-700 transition">Dashboard</button>
          </div>
          <button onClick={() => navigate('/dashboard')} className="text-sm text-slate-500 hover:text-blue-700 transition">
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">

        {/* ── Page Header ── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full mb-4">
            🎯 AI-Powered ATS Analyzer
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">ATS Score Checker</h1>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            Paste your resume and job description below. Our AI will analyze keyword matches,
            calculate your ATS score, and give you actionable suggestions.
          </p>
        </div>

        {/* ── Input Section ── */}
        {!result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

            {/* Resume Input */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900">📄 Your Resume</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Paste your resume text below</p>
                </div>
                <span className="text-xs text-gray-400">{resumeText.length} chars</span>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-4">
                {['paste', 'tips'].map(t => (
                  <button key={t} onClick={() => setActiveTab(t)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition
                      ${activeTab === t ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {t === 'paste' ? '📋 Paste Text' : '💡 Tips'}
                  </button>
                ))}
              </div>

              {activeTab === 'paste' ? (
                <textarea
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  rows={14}
                  placeholder="Paste your full resume text here...

John Smith
john@email.com | +91 98765 43210 | Pune

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years...

WORK EXPERIENCE
Software Engineer — Google (2020-Present)
- Built scalable microservices...

SKILLS
React, Node.js, Python, AWS..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none text-gray-700"
                />
              ) : (
                <div className="space-y-3 py-2">
                  {[
                    { icon: '✅', tip: 'Copy your resume as plain text — no formatting needed' },
                    { icon: '✅', tip: 'Include all sections: Summary, Experience, Skills, Education' },
                    { icon: '✅', tip: 'Spell out abbreviations e.g. "JavaScript" not just "JS"' },
                    { icon: '❌', tip: 'Don\'t include headers, footers or page numbers' },
                    { icon: '❌', tip: 'Remove special characters and tables before pasting' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                      <span>{item.icon}</span>
                      <span>{item.tip}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Job Description Input */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-gray-900">💼 Job Description</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Paste the full job posting</p>
                </div>
                <span className="text-xs text-gray-400">{jobDesc.length} chars</span>
              </div>
              <textarea
                value={jobDesc}
                onChange={e => setJobDesc(e.target.value)}
                rows={16}
                placeholder="Paste the full job description here...

Software Engineer — Google
Location: Bangalore, India

About the Role:
We are looking for a talented Software Engineer to join our team...

Requirements:
- 3+ years of experience with React and Node.js
- Strong understanding of REST APIs
- Experience with cloud platforms (AWS/GCP)
- Excellent communication skills..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none text-gray-700"
              />
            </div>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-5 py-3 rounded-xl mb-4 flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        {/* ── Check Button ── */}
        {!result && (
          <div className="flex justify-center mb-10">
            <button onClick={handleCheck} disabled={loading}
              className="px-10 py-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-base transition shadow-md disabled:opacity-60 flex items-center gap-3">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Analyzing your resume...
                </>
              ) : '🎯 Check ATS Score'}
            </button>
          </div>
        )}

        {/* ══ RESULTS ══ */}
        {result && level && (
          <div ref={resultRef} className="space-y-6">

            {/* Score Hero */}
            <div className={`rounded-2xl border-2 p-8 ${level.bg} ${level.border}`}>
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">

                {/* Score Circle */}
                <div className="flex flex-col items-center">
                  <div className={`w-36 h-36 rounded-full border-8 flex flex-col items-center justify-center shadow-lg
                    ${result.score >= 80 ? 'border-green-500' :
                      result.score >= 60 ? 'border-blue-500' :
                      result.score >= 40 ? 'border-yellow-500' :
                      'border-red-500'} bg-white`}>
                    <span className={`text-4xl font-extrabold ${level.color}`}>{result.score}%</span>
                    <span className="text-xs text-gray-400 mt-1">ATS Score</span>
                  </div>
                  <span className="text-2xl mt-2">{level.icon}</span>
                </div>

                {/* Score Details */}
                <div className="flex-1">
                  <h2 className={`text-2xl font-bold mb-2 ${level.color}`}>{level.label}</h2>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">{result.summary}</p>

                  {/* Score Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>ATS Match Score</span>
                      <span className={`font-bold ${level.color}`}>{result.score}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className={`h-3 rounded-full transition-all duration-700 ${level.bar}`}
                        style={{ width: `${result.score}%` }}>
                      </div>
                    </div>
                  </div>

                  {/* Score Scale */}
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    {[
                      { range: '0-39%',  label: 'Needs Work', color: 'text-red-600' },
                      { range: '40-59%', label: 'Fair',       color: 'text-yellow-600' },
                      { range: '60-79%', label: 'Good',       color: 'text-blue-600' },
                      { range: '80%+',   label: 'Excellent',  color: 'text-green-600' },
                    ].map((s, i) => (
                      <div key={i} className={`text-center font-semibold ${s.color}`}>
                        <div>{s.range}</div>
                        <div className="text-gray-400 font-normal">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3 min-w-fit">
                  {[
                    { label: 'Keywords Matched', value: result.matched?.length ?? 0, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Keywords Missing', value: result.missing?.length ?? 0, color: 'text-red-600',   bg: 'bg-red-50' },
                    { label: 'Suggestions',      value: result.suggestions?.length ?? 0, color: 'text-blue-600',  bg: 'bg-blue-50' },
                    { label: 'Score Level',       value: level.icon,                  color: 'text-gray-700', bg: 'bg-gray-50' },
                  ].map((stat, i) => (
                    <div key={i} className={`${stat.bg} rounded-xl p-3 text-center`}>
                      <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Details Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Matched Keywords */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-base font-bold text-green-700 mb-4">
                  ✅ Matched Keywords
                  <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                    {result.matched?.length ?? 0} found
                  </span>
                </h3>
                {result.matched?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.matched.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-full">
                        {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No matched keywords found</p>
                )}
              </div>

              {/* Missing Keywords */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-base font-bold text-red-700 mb-4">
                  ❌ Missing Keywords
                  <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                    {result.missing?.length ?? 0} missing
                  </span>
                </h3>
                {result.missing?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.missing.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-full">
                        {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Great! No missing keywords.</p>
                )}
              </div>

              {/* Suggestions */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-base font-bold text-blue-700 mb-4">
                  💡 Suggestions
                </h3>
                <ul className="space-y-3">
                  {result.suggestions?.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                      <span className="mt-0.5 w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {i + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Action Buttons ── */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleReset}
                className="flex-1 py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition">
                🔄 Check Another Resume
              </button>
              <button onClick={() => navigate('/resume/new')}
                className="flex-1 py-3 border-2 border-blue-700 text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition">
                📄 Improve My Resume
              </button>
              <button onClick={() => navigate('/dashboard')}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition">
                📊 Go to Dashboard
              </button>
            </div>

            {/* ── Score History ── */}
            {history.length > 1 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-base font-bold text-gray-900 mb-4">📈 Session History</h3>
                <div className="space-y-3">
                  {history.map((h, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
                      <span className="text-sm text-gray-600">Check #{history.length - i}</span>
                      <span className="text-xs text-gray-400">{h.date}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold
                        ${h.score >= 80 ? 'bg-green-100 text-green-700' :
                          h.score >= 60 ? 'bg-blue-100 text-blue-700' :
                          h.score >= 40 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'}`}>
                        {h.score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* ── FOOTER ── */}
    <Footer />
    </div>
  )
}