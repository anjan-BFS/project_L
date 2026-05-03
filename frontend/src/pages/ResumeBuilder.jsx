import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createResume, generateResume } from '../utils/api'

// ── Step config ──────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Personal Info',  icon: '👤' },
  { id: 2, label: 'Experience',     icon: '💼' },
  { id: 3, label: 'Education',      icon: '🎓' },
  { id: 4, label: 'Skills',         icon: '🛠️' },
  { id: 5, label: 'Summary',        icon: '📝' },
  { id: 6, label: 'Preview',        icon: '👁️' },
]

const EMPTY_EXPERIENCE = { company: '', role: '', startDate: '', endDate: '', current: false, bullets: '' }
const EMPTY_EDUCATION  = { institution: '', degree: '', field: '', year: '' }

export default function ResumeBuilder() {
  const navigate  = useNavigate()
  const [step, setStep]       = useState(1)
  const [saving, setSaving]   = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [saved, setSaved]     = useState(false)
  const [errors, setErrors]   = useState({})

  // ── Form State ───────────────────────────────────────────
  const [personal, setPersonal] = useState({
    fullName: '', email: '', phone: '', location: '',
    linkedin: '', portfolio: '',
  })

  const [experiences, setExperiences] = useState([{ ...EMPTY_EXPERIENCE }])
  const [educations,  setEducations]  = useState([{ ...EMPTY_EDUCATION }])

  const [skills, setSkills] = useState({
    technical: '', soft: '', tools: '', languages: '',
  })

  const [summary, setSummary] = useState('')
  const [resumeTitle, setResumeTitle] = useState('')

  // ── Validation ───────────────────────────────────────────
  const validate = () => {
    const e = {}
    if (step === 1) {
      if (!personal.fullName.trim()) e.fullName = 'Full name is required'
      if (!personal.email.trim())    e.email    = 'Email is required'
      if (!personal.phone.trim())    e.phone    = 'Phone is required'
    }
    if (step === 5 && !resumeTitle.trim()) e.resumeTitle = 'Resume title is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (validate()) setStep(s => Math.min(s + 1, 6)) }
  const back = () => { setStep(s => Math.max(s - 1, 1)); setErrors({}) }

  // ── Experience helpers ───────────────────────────────────
  const updateExp = (i, field, value) => {
    const updated = [...experiences]
    updated[i] = { ...updated[i], [field]: value }
    setExperiences(updated)
  }
  const addExp    = () => setExperiences([...experiences, { ...EMPTY_EXPERIENCE }])
  const removeExp = (i) => setExperiences(experiences.filter((_, idx) => idx !== i))

  // ── Education helpers ────────────────────────────────────
  const updateEdu = (i, field, value) => {
    const updated = [...educations]
    updated[i] = { ...updated[i], [field]: value }
    setEducations(updated)
  }
  const addEdu    = () => setEducations([...educations, { ...EMPTY_EDUCATION }])
  const removeEdu = (i) => setEducations(educations.filter((_, idx) => idx !== i))

  // ── AI Generate Summary ──────────────────────────────────
  const handleAIGenerate = async () => {
    setAiLoading(true)
    try {
      const res = await generateResume({
        fullName:    personal.fullName,
        experience:  experiences,
        education:   educations,
        skills:      skills,
      })
      setSummary(res.generatedResume || '')
    } catch {
      setSummary('Experienced professional with a strong background in delivering results. Skilled in collaboration, problem-solving, and achieving business goals.')
    } finally {
      setAiLoading(false)
    }
  }

  // ── Save Resume ──────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true)
    try {
      await createResume({
        title: resumeTitle,
        content_json: { personal, experiences, educations, skills, summary },
      })
      setSaved(true)
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      alert('Failed to save resume. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // ── Input style ──────────────────────────────────────────
  const inp = (hasErr) =>
    `w-full px-4 py-3 rounded-lg border text-sm outline-none transition
    ${hasErr
      ? 'border-red-400 bg-red-50'
      : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`

  const label = (text, required = false) => (
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      {text} {required && <span className="text-red-500">*</span>}
    </label>
  )

  // ════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── NAVBAR ── */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/home')}>
            <div className="w-8 h-8 bg-blue-700 rounded-md"></div>
            <span className="text-xl font-bold text-blue-800">CareerCraft AI</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-500 hover:text-blue-700 transition">
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">

        {/* ── Page Title ── */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-900">Build Your Resume</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in each section — AI will help you generate content</p>
        </div>

        {/* ── Step Indicator ── */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div
                className={`flex flex-col items-center cursor-pointer`}
                onClick={() => step > s.id && setStep(s.id)}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition
                  ${step === s.id   ? 'bg-blue-700 text-white shadow-md scale-110' :
                    step > s.id     ? 'bg-green-500 text-white' :
                    'bg-gray-200 text-gray-500'}`}>
                  {step > s.id ? '✓' : s.icon}
                </div>
                <span className={`text-xs mt-1 font-medium hidden sm:block
                  ${step === s.id ? 'text-blue-700' : step > s.id ? 'text-green-600' : 'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-1 w-8 sm:w-12 mx-1 rounded transition
                  ${step > s.id ? 'bg-green-400' : 'bg-gray-200'}`}>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Form Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">

          {/* ══ STEP 1 — Personal Info ══ */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-bold text-blue-900 mb-6">👤 Personal Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  {label('Full Name', true)}
                  <input value={personal.fullName} onChange={e => setPersonal({...personal, fullName: e.target.value})}
                    placeholder="John Smith" className={inp(errors.fullName)} />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  {label('Email Address', true)}
                  <input type="email" value={personal.email} onChange={e => setPersonal({...personal, email: e.target.value})}
                    placeholder="john@example.com" className={inp(errors.email)} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  {label('Phone Number', true)}
                  <input value={personal.phone} onChange={e => setPersonal({...personal, phone: e.target.value})}
                    placeholder="+91 98765 43210" className={inp(errors.phone)} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  {label('Location')}
                  <input value={personal.location} onChange={e => setPersonal({...personal, location: e.target.value})}
                    placeholder="Pune, Maharashtra" className={inp(false)} />
                </div>
                <div>
                  {label('LinkedIn URL')}
                  <input value={personal.linkedin} onChange={e => setPersonal({...personal, linkedin: e.target.value})}
                    placeholder="linkedin.com/in/johnsmith" className={inp(false)} />
                </div>
                <div>
                  {label('Portfolio / Website')}
                  <input value={personal.portfolio} onChange={e => setPersonal({...personal, portfolio: e.target.value})}
                    placeholder="johnsmith.dev" className={inp(false)} />
                </div>
              </div>
            </div>
          )}

          {/* ══ STEP 2 — Experience ══ */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-bold text-blue-900 mb-6">💼 Work Experience</h2>
              {experiences.map((exp, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-5 mb-5 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-blue-800">Experience #{i + 1}</span>
                    {experiences.length > 1 && (
                      <button onClick={() => removeExp(i)} className="text-xs text-red-500 hover:text-red-700 font-semibold">
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      {label('Company Name')}
                      <input value={exp.company} onChange={e => updateExp(i, 'company', e.target.value)}
                        placeholder="Google Inc." className={inp(false)} />
                    </div>
                    <div>
                      {label('Job Title / Role')}
                      <input value={exp.role} onChange={e => updateExp(i, 'role', e.target.value)}
                        placeholder="Software Engineer" className={inp(false)} />
                    </div>
                    <div>
                      {label('Start Date')}
                      <input type="month" value={exp.startDate} onChange={e => updateExp(i, 'startDate', e.target.value)}
                        className={inp(false)} />
                    </div>
                    <div>
                      {label('End Date')}
                      <input type="month" value={exp.endDate} onChange={e => updateExp(i, 'endDate', e.target.value)}
                        disabled={exp.current} className={inp(false)} />
                      <label className="flex items-center gap-2 mt-2 cursor-pointer">
                        <input type="checkbox" checked={exp.current}
                          onChange={e => updateExp(i, 'current', e.target.checked)}
                          className="accent-blue-700" />
                        <span className="text-xs text-gray-600">Currently working here</span>
                      </label>
                    </div>
                    <div className="sm:col-span-2">
                      {label('Key Responsibilities / Achievements')}
                      <textarea value={exp.bullets} onChange={e => updateExp(i, 'bullets', e.target.value)}
                        rows={3} placeholder="• Led a team of 5 engineers&#10;• Increased performance by 40%&#10;• Delivered project 2 weeks ahead of schedule"
                        className={inp(false) + ' resize-none'} />
                      <p className="text-xs text-gray-400 mt-1">One point per line. Start each with •</p>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addExp}
                className="w-full py-3 border-2 border-dashed border-blue-300 text-blue-600 font-semibold text-sm rounded-xl hover:border-blue-500 hover:bg-blue-50 transition">
                + Add Another Experience
              </button>
            </div>
          )}

          {/* ══ STEP 3 — Education ══ */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold text-blue-900 mb-6">🎓 Education</h2>
              {educations.map((edu, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-5 mb-5 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-blue-800">Education #{i + 1}</span>
                    {educations.length > 1 && (
                      <button onClick={() => removeEdu(i)} className="text-xs text-red-500 hover:text-red-700 font-semibold">
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      {label('Institution / University')}
                      <input value={edu.institution} onChange={e => updateEdu(i, 'institution', e.target.value)}
                        placeholder="University of Pune" className={inp(false)} />
                    </div>
                    <div>
                      {label('Degree')}
                      <input value={edu.degree} onChange={e => updateEdu(i, 'degree', e.target.value)}
                        placeholder="Bachelor of Engineering" className={inp(false)} />
                    </div>
                    <div>
                      {label('Field of Study')}
                      <input value={edu.field} onChange={e => updateEdu(i, 'field', e.target.value)}
                        placeholder="Computer Science" className={inp(false)} />
                    </div>
                    <div>
                      {label('Graduation Year')}
                      <input type="number" value={edu.year} onChange={e => updateEdu(i, 'year', e.target.value)}
                        placeholder="2022" min="1990" max="2030" className={inp(false)} />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addEdu}
                className="w-full py-3 border-2 border-dashed border-blue-300 text-blue-600 font-semibold text-sm rounded-xl hover:border-blue-500 hover:bg-blue-50 transition">
                + Add Another Education
              </button>
            </div>
          )}

          {/* ══ STEP 4 — Skills ══ */}
          {step === 4 && (
            <div>
              <h2 className="text-lg font-bold text-blue-900 mb-6">🛠️ Skills</h2>
              <div className="space-y-5">
                <div>
                  {label('Technical Skills')}
                  <input value={skills.technical} onChange={e => setSkills({...skills, technical: e.target.value})}
                    placeholder="React, Node.js, Python, SQL, REST APIs" className={inp(false)} />
                  <p className="text-xs text-gray-400 mt-1">Separate skills with commas</p>
                </div>
                <div>
                  {label('Soft Skills')}
                  <input value={skills.soft} onChange={e => setSkills({...skills, soft: e.target.value})}
                    placeholder="Leadership, Communication, Problem Solving, Teamwork" className={inp(false)} />
                </div>
                <div>
                  {label('Tools & Platforms')}
                  <input value={skills.tools} onChange={e => setSkills({...skills, tools: e.target.value})}
                    placeholder="Git, Docker, AWS, Jira, Figma" className={inp(false)} />
                </div>
                <div>
                  {label('Languages')}
                  <input value={skills.languages} onChange={e => setSkills({...skills, languages: e.target.value})}
                    placeholder="English (Fluent), Hindi (Native), Marathi (Native)" className={inp(false)} />
                </div>
              </div>
            </div>
          )}

          {/* ══ STEP 5 — Summary ══ */}
          {step === 5 && (
            <div>
              <h2 className="text-lg font-bold text-blue-900 mb-6">📝 Professional Summary</h2>

              {/* Resume Title */}
              <div className="mb-5">
                {label('Resume Title', true)}
                <input value={resumeTitle} onChange={e => { setResumeTitle(e.target.value); setErrors({}) }}
                  placeholder="e.g. Full Stack Developer Resume — 2026" className={inp(errors.resumeTitle)} />
                {errors.resumeTitle && <p className="text-red-500 text-xs mt-1">{errors.resumeTitle}</p>}
                <p className="text-xs text-gray-400 mt-1">This is how your resume will be saved in your dashboard</p>
              </div>

              {/* AI Generate */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-bold text-blue-800">✨ AI Generate Summary</p>
                    <p className="text-xs text-blue-600">Let AI write a professional summary based on your details</p>
                  </div>
                  <button onClick={handleAIGenerate} disabled={aiLoading}
                    className="px-4 py-2 bg-blue-700 text-white text-xs font-bold rounded-lg hover:bg-blue-800 transition disabled:opacity-60 flex items-center gap-2">
                    {aiLoading ? (
                      <>
                        <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Generating...
                      </>
                    ) : '✨ Generate'}
                  </button>
                </div>
              </div>

              {/* Summary textarea */}
              <div>
                {label('Professional Summary')}
                <textarea value={summary} onChange={e => setSummary(e.target.value)}
                  rows={6} placeholder="Write or generate a 2-4 sentence professional summary highlighting your experience, skills and career goals..."
                  className={inp(false) + ' resize-none'} />
                <p className="text-xs text-gray-400 mt-1">
                  {summary.length} characters — Aim for 200-400 characters
                </p>
              </div>
            </div>
          )}

          {/* ══ STEP 6 — Preview ══ */}
          {step === 6 && (
            <div>
              <h2 className="text-lg font-bold text-blue-900 mb-6">👁️ Resume Preview</h2>

              {/* Resume Preview Card */}
              <div className="border border-gray-200 rounded-xl p-8 bg-white shadow-sm font-sans text-sm text-gray-800">

                {/* Header */}
                <div className="border-b-2 border-blue-700 pb-4 mb-5">
                  <h1 className="text-2xl font-bold text-blue-900">{personal.fullName || 'Your Name'}</h1>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                    {personal.email    && <span>📧 {personal.email}</span>}
                    {personal.phone    && <span>📱 {personal.phone}</span>}
                    {personal.location && <span>📍 {personal.location}</span>}
                    {personal.linkedin && <span>🔗 {personal.linkedin}</span>}
                    {personal.portfolio && <span>🌐 {personal.portfolio}</span>}
                  </div>
                </div>

                {/* Summary */}
                {summary && (
                  <div className="mb-5">
                    <h2 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-2">Professional Summary</h2>
                    <p className="text-gray-700 leading-relaxed">{summary}</p>
                  </div>
                )}

                {/* Experience */}
                {experiences.some(e => e.company) && (
                  <div className="mb-5">
                    <h2 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-3">Work Experience</h2>
                    {experiences.filter(e => e.company).map((exp, i) => (
                      <div key={i} className="mb-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-gray-900">{exp.role}</p>
                            <p className="text-blue-700 font-semibold text-xs">{exp.company}</p>
                          </div>
                          <p className="text-xs text-gray-400">
                            {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                          </p>
                        </div>
                        {exp.bullets && (
                          <ul className="mt-2 space-y-1">
                            {exp.bullets.split('\n').filter(b => b.trim()).map((b, j) => (
                              <li key={j} className="text-xs text-gray-600">{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Education */}
                {educations.some(e => e.institution) && (
                  <div className="mb-5">
                    <h2 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-3">Education</h2>
                    {educations.filter(e => e.institution).map((edu, i) => (
                      <div key={i} className="mb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-gray-900">{edu.degree} in {edu.field}</p>
                            <p className="text-blue-700 font-semibold text-xs">{edu.institution}</p>
                          </div>
                          <p className="text-xs text-gray-400">{edu.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills */}
                {(skills.technical || skills.soft || skills.tools || skills.languages) && (
                  <div>
                    <h2 className="text-sm font-bold text-blue-800 uppercase tracking-wider mb-3">Skills</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {skills.technical && <div><span className="font-semibold text-gray-700">Technical: </span>{skills.technical}</div>}
                      {skills.soft      && <div><span className="font-semibold text-gray-700">Soft Skills: </span>{skills.soft}</div>}
                      {skills.tools     && <div><span className="font-semibold text-gray-700">Tools: </span>{skills.tools}</div>}
                      {skills.languages && <div><span className="font-semibold text-gray-700">Languages: </span>{skills.languages}</div>}
                    </div>
                  </div>
                )}
              </div>

              {/* Save Button */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button onClick={handleSave} disabled={saving || saved}
                  className="flex-1 py-3 bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-800 transition disabled:opacity-60 flex items-center justify-center gap-2">
                  {saved ? '✅ Saved! Redirecting...' : saving ? (
                    <>
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Saving...
                    </>
                  ) : '💾 Save Resume'}
                </button>
                <button onClick={() => window.print()}
                  className="flex-1 py-3 border-2 border-blue-700 text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition">
                  🖨️ Print / Export PDF
                </button>
              </div>
            </div>
          )}

          {/* ── Navigation Buttons ── */}
          {step < 6 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              <button onClick={back} disabled={step === 1}
                className="px-6 py-3 border border-gray-300 text-gray-600 font-semibold text-sm rounded-lg hover:bg-gray-50 transition disabled:opacity-40">
                ← Back
              </button>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                Step {step} of {STEPS.length}
              </div>
              <button onClick={next}
                className="px-6 py-3 bg-blue-700 text-white font-semibold text-sm rounded-lg hover:bg-blue-800 transition">
                {step === 5 ? 'Preview Resume →' : 'Next →'}
              </button>
            </div>
          )}

          {/* Back button on preview */}
          {step === 6 && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button onClick={back} className="text-sm text-gray-500 hover:text-blue-700 transition">
                ← Edit Resume
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}