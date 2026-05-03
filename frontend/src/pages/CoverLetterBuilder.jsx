import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCoverLetter, generateCover } from '../utils/api'

const STEPS = [
  { id: 1, label: 'Job Details',    icon: '💼' },
  { id: 2, label: 'Your Background', icon: '👤' },
  { id: 3, label: 'Generate',       icon: '✨' },
  { id: 4, label: 'Preview',        icon: '👁️' },
]

const TONES = [
  { value: 'professional', label: '👔 Professional', desc: 'Formal and corporate' },
  { value: 'confident',    label: '💪 Confident',    desc: 'Bold and assertive' },
  { value: 'friendly',     label: '😊 Friendly',     desc: 'Warm and approachable' },
  { value: 'concise',      label: '⚡ Concise',      desc: 'Short and to the point' },
]

export default function CoverLetterBuilder() {
  const navigate   = useNavigate()
  const [step, setStep]         = useState(1)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [errors, setErrors]     = useState({})

  // ── Form State ───────────────────────────────────────────
  const [jobDetails, setJobDetails] = useState({
    jobTitle:    '',
    companyName: '',
    jobDescription: '',
    hiringManager: '',
  })

  const [background, setBackground] = useState({
    fullName:       '',
    currentRole:    '',
    yearsExp:       '',
    keySkills:      '',
    achievement:    '',
    whyCompany:     '',
  })

  const [tone, setTone]         = useState('professional')
  const [coverLetter, setCoverLetter] = useState('')

  // ── Validation ───────────────────────────────────────────
  const validate = () => {
    const e = {}
    if (step === 1) {
      if (!jobDetails.jobTitle.trim())    e.jobTitle    = 'Job title is required'
      if (!jobDetails.companyName.trim()) e.companyName = 'Company name is required'
      if (!jobDetails.jobDescription.trim()) e.jobDescription = 'Job description is required'
    }
    if (step === 2) {
      if (!background.fullName.trim())    e.fullName    = 'Your name is required'
      if (!background.currentRole.trim()) e.currentRole = 'Current role is required'
      if (!background.keySkills.trim())   e.keySkills   = 'Key skills are required'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => { if (validate()) setStep(s => Math.min(s + 1, 4)) }
  const back = () => { setStep(s => Math.max(s - 1, 1)); setErrors({}) }

  // ── AI Generate ──────────────────────────────────────────
  const handleGenerate = async () => {
    setAiLoading(true)
    try {
      const res = await generateCover({
        jobTitle:       jobDetails.jobTitle,
        companyName:    jobDetails.companyName,
        jobDescription: jobDetails.jobDescription,
        hiringManager:  jobDetails.hiringManager,
        fullName:       background.fullName,
        currentRole:    background.currentRole,
        yearsExp:       background.yearsExp,
        keySkills:      background.keySkills,
        achievement:    background.achievement,
        whyCompany:     background.whyCompany,
        tone,
      })
      setCoverLetter(res.generatedCoverLetter || '')
      setStep(4)
    } catch {
      // Fallback placeholder
      setCoverLetter(
        `Dear ${jobDetails.hiringManager || 'Hiring Manager'},\n\nI am writing to express my strong interest in the ${jobDetails.jobTitle} position at ${jobDetails.companyName}. With my background as a ${background.currentRole} and ${background.yearsExp || 'several'} years of experience in ${background.keySkills}, I am confident I would be a valuable addition to your team.\n\n${background.achievement ? `One of my key achievements includes: ${background.achievement}\n\n` : ''}I am particularly drawn to ${jobDetails.companyName} because ${background.whyCompany || 'of your reputation for excellence and innovation'}. I am excited about the opportunity to contribute to your team and grow with your organization.\n\nThank you for considering my application. I look forward to discussing how my skills align with your needs.\n\nSincerely,\n${background.fullName}`
      )
      setStep(4)
    } finally {
      setAiLoading(false)
    }
  }

  // ── Save ─────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true)
    try {
      await createCoverLetter({
        job_title:    jobDetails.jobTitle,
        company_name: jobDetails.companyName,
        content:      coverLetter,
      })
      setSaved(true)
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch {
      alert('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // ── Helpers ──────────────────────────────────────────────
  const inp = (hasErr) =>
    `w-full px-4 py-3 rounded-lg border text-sm outline-none transition
    ${hasErr
      ? 'border-red-400 bg-red-50'
      : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`

  const lbl = (text, required = false) => (
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
          <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-500 hover:text-blue-700 transition">
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">

        {/* ── Page Title ── */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-900">Build Your Cover Letter</h1>
          <p className="text-gray-500 text-sm mt-1">
            Fill in the details — AI will generate a tailored cover letter for you
          </p>
        </div>

        {/* ── Step Indicator ── */}
        <div className="flex items-center justify-center mb-8">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center">
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
                <div className={`h-1 w-12 sm:w-20 mx-1 rounded transition
                  ${step > s.id ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* ── Form Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">

          {/* ══ STEP 1 — Job Details ══ */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-bold text-blue-900 mb-6">💼 Job Details</h2>
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    {lbl('Job Title', true)}
                    <input value={jobDetails.jobTitle}
                      onChange={e => { setJobDetails({...jobDetails, jobTitle: e.target.value}); setErrors({...errors, jobTitle: ''}) }}
                      placeholder="Software Engineer" className={inp(errors.jobTitle)} />
                    {errors.jobTitle && <p className="text-red-500 text-xs mt-1">{errors.jobTitle}</p>}
                  </div>
                  <div>
                    {lbl('Company Name', true)}
                    <input value={jobDetails.companyName}
                      onChange={e => { setJobDetails({...jobDetails, companyName: e.target.value}); setErrors({...errors, companyName: ''}) }}
                      placeholder="Google, Microsoft, TCS..." className={inp(errors.companyName)} />
                    {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName}</p>}
                  </div>
                </div>
                <div>
                  {lbl('Hiring Manager Name')}
                  <input value={jobDetails.hiringManager}
                    onChange={e => setJobDetails({...jobDetails, hiringManager: e.target.value})}
                    placeholder="Mr. John Doe (leave blank to use 'Hiring Manager')" className={inp(false)} />
                </div>
                <div>
                  {lbl('Job Description', true)}
                  <textarea value={jobDetails.jobDescription}
                    onChange={e => { setJobDetails({...jobDetails, jobDescription: e.target.value}); setErrors({...errors, jobDescription: ''}) }}
                    rows={6} placeholder="Paste the full job description here. The AI will use this to tailor your cover letter with matching keywords..."
                    className={inp(errors.jobDescription) + ' resize-none'} />
                  {errors.jobDescription && <p className="text-red-500 text-xs mt-1">{errors.jobDescription}</p>}
                  <p className="text-xs text-gray-400 mt-1">
                    💡 Tip: The more detail you provide, the better the AI-generated letter
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ══ STEP 2 — Your Background ══ */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-bold text-blue-900 mb-6">👤 Your Background</h2>
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    {lbl('Your Full Name', true)}
                    <input value={background.fullName}
                      onChange={e => { setBackground({...background, fullName: e.target.value}); setErrors({...errors, fullName: ''}) }}
                      placeholder="John Smith" className={inp(errors.fullName)} />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                  </div>
                  <div>
                    {lbl('Current / Most Recent Role', true)}
                    <input value={background.currentRole}
                      onChange={e => { setBackground({...background, currentRole: e.target.value}); setErrors({...errors, currentRole: ''}) }}
                      placeholder="Senior Software Engineer" className={inp(errors.currentRole)} />
                    {errors.currentRole && <p className="text-red-500 text-xs mt-1">{errors.currentRole}</p>}
                  </div>
                </div>
                <div>
                  {lbl('Years of Experience')}
                  <input value={background.yearsExp}
                    onChange={e => setBackground({...background, yearsExp: e.target.value})}
                    placeholder="5 years" className={inp(false)} />
                </div>
                <div>
                  {lbl('Key Skills', true)}
                  <input value={background.keySkills}
                    onChange={e => { setBackground({...background, keySkills: e.target.value}); setErrors({...errors, keySkills: ''}) }}
                    placeholder="React, Node.js, AWS, Team Leadership, Agile" className={inp(errors.keySkills)} />
                  {errors.keySkills && <p className="text-red-500 text-xs mt-1">{errors.keySkills}</p>}
                  <p className="text-xs text-gray-400 mt-1">Separate skills with commas</p>
                </div>
                <div>
                  {lbl('Your Best Achievement')}
                  <textarea value={background.achievement}
                    onChange={e => setBackground({...background, achievement: e.target.value})}
                    rows={3} placeholder="e.g. Led a team of 8 engineers to deliver a product used by 1M+ users, 3 weeks ahead of schedule..."
                    className={inp(false) + ' resize-none'} />
                  <p className="text-xs text-gray-400 mt-1">
                    💡 Quantified achievements make your cover letter stand out
                  </p>
                </div>
                <div>
                  {lbl('Why This Company?')}
                  <textarea value={background.whyCompany}
                    onChange={e => setBackground({...background, whyCompany: e.target.value})}
                    rows={3} placeholder={`Why do you want to work at ${jobDetails.companyName || 'this company'}? What excites you about them?`}
                    className={inp(false) + ' resize-none'} />
                </div>
              </div>
            </div>
          )}

          {/* ══ STEP 3 — Tone + Generate ══ */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold text-blue-900 mb-2">✨ Generate Cover Letter</h2>
              <p className="text-gray-500 text-sm mb-6">
                Choose a tone and let AI write your tailored cover letter
              </p>

              {/* Tone Selector */}
              <div className="mb-8">
                <p className="text-sm font-semibold text-gray-700 mb-3">Select Writing Tone:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {TONES.map((t) => (
                    <button key={t.value} onClick={() => setTone(t.value)}
                      className={`p-3 rounded-xl border-2 text-left transition
                        ${tone === t.value
                          ? 'border-blue-700 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'}`}>
                      <p className="text-sm font-bold text-gray-800">{t.label}</p>
                      <p className="text-xs text-gray-400 mt-1">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary Box */}
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 mb-8">
                <p className="text-sm font-bold text-gray-700 mb-3">📋 Summary of Your Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                  <div><span className="font-semibold">Job: </span>{jobDetails.jobTitle} at {jobDetails.companyName}</div>
                  <div><span className="font-semibold">Applicant: </span>{background.fullName}</div>
                  <div><span className="font-semibold">Current Role: </span>{background.currentRole}</div>
                  <div><span className="font-semibold">Experience: </span>{background.yearsExp || 'Not specified'}</div>
                  <div><span className="font-semibold">Tone: </span>{TONES.find(t => t.value === tone)?.label}</div>
                  <div><span className="font-semibold">Skills: </span>{background.keySkills}</div>
                </div>
              </div>

              {/* Generate Button */}
              <button onClick={handleGenerate} disabled={aiLoading}
                className="w-full py-4 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-base transition disabled:opacity-60 flex items-center justify-center gap-3 shadow-md">
                {aiLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    AI is writing your cover letter...
                  </>
                ) : '✨ Generate Cover Letter with AI'}
              </button>
            </div>
          )}

          {/* ══ STEP 4 — Preview & Save ══ */}
          {step === 4 && (
            <div>
              <h2 className="text-lg font-bold text-blue-900 mb-6">👁️ Your Cover Letter</h2>

              {/* Editable Cover Letter */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  {lbl('Cover Letter Content')}
                  <span className="text-xs text-gray-400">{coverLetter.length} characters</span>
                </div>
                <textarea
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  rows={16}
                  className="w-full px-5 py-4 rounded-xl border border-gray-300 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none font-sans leading-relaxed"
                />
                <p className="text-xs text-gray-400 mt-1">
                  ✏️ You can edit the generated letter directly above
                </p>
              </div>

              {/* Preview Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  📄 Formatted Preview
                </p>
                <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line font-serif">
                  {coverLetter}
                </div>
              </div>

              {/* Job info badge */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  💼 {jobDetails.jobTitle}
                </span>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                  🏢 {jobDetails.companyName}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">
                  🎨 {TONES.find(t => t.value === tone)?.label} Tone
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
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
                  ) : '💾 Save Cover Letter'}
                </button>
                <button onClick={() => window.print()}
                  className="flex-1 py-3 border-2 border-blue-700 text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition">
                  🖨️ Print / Export PDF
                </button>
                <button onClick={() => setStep(3)}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-600 font-bold rounded-lg hover:bg-gray-50 transition">
                  🔄 Regenerate
                </button>
              </div>
            </div>
          )}

          {/* ── Navigation Buttons ── */}
          {step < 3 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
              <button onClick={back} disabled={step === 1}
                className="px-6 py-3 border border-gray-300 text-gray-600 font-semibold text-sm rounded-lg hover:bg-gray-50 transition disabled:opacity-40">
                ← Back
              </button>
              <div className="text-xs text-gray-400 flex items-center">
                Step {step} of {STEPS.length}
              </div>
              <button onClick={next}
                className="px-6 py-3 bg-blue-700 text-white font-semibold text-sm rounded-lg hover:bg-blue-800 transition">
                Next →
              </button>
            </div>
          )}

          {/* Back on step 3 & 4 */}
          {(step === 3 || step === 4) && (
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
              <button onClick={back} className="text-sm text-gray-500 hover:text-blue-700 transition">
                ← Back
              </button>
              <span className="text-xs text-gray-400">Step {step} of {STEPS.length}</span>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}