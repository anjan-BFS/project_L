import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// API / service imports
import {
  getProfile,
  getResumes,
  getCoverLetters,
  updateProfile,
  changePassword,
  deleteResume,
  deleteCoverLetter,
  uploadProfilePicture,
  updateProfilePicture,
  clearToken,
  supabase ,
} from "../utils/api";
import Footer from '../components/Footer';

export default function Dashboard() {
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [updateForm, setUpdateForm] = useState({ name: '', email: '' })
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' })
  const [updateError, setUpdateError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [coverLetters, setCoverLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("resumes");
  const [uploading, setUploading] = useState(false);
  const handleProfilePictureUpload = async (e) => {
  export const uploadProfilePicture = async (file) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('profile-pictures')
    .upload(fileName, file)

  if (error) {
    console.error(error)
    throw error
  }

  const { data: publicUrlData } = supabase.storage
    .from('profile-pictures')
    .getPublicUrl(fileName)

  return publicUrlData.publicUrl
};

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError("");
      try {
        const [profileData, resumeData, coverData] = await Promise.all([
          getProfile(),
          getResumes(),
          getCoverLetters(),
        ]);
        setUser({
          name: profileData.name || "User",
          email: profileData.email || "",
          memberSince: profileData.memberSince
            ? new Date(profileData.memberSince).toLocaleDateString()
            : "N/A",
          role: "Career Customer",
        });
        setResumes(resumeData.resumes || []);
        setCoverLetters(coverData.coverLetters || []);
      } catch (err) {
        const message = err.message || "Unable to load dashboard data";
        // If auth error → redirect to login
        if (
          message.toLowerCase().includes("authentication") ||
          message.toLowerCase().includes("token")
        ) {
          clearToken();
          navigate("/login");
          return;
        }
        // For now (before backend is ready) set mock user
        setUser({
          name: "Anjan",
          email: "anjan@example.com",
          memberSince: "01/05/2026",
          role: "Career Customer",
        });
        setResumes([]);
        setCoverLetters([]);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [navigate]);

  const atsHistory = useMemo(() => {
    return resumes.map((item) => ({
      id: item.id,
      date: item.updated_at || item.created_at || "Unknown",
      job: item.title,
      score: item.ats_score ?? 0,
    }));
  }, [resumes]);

  const handleLogout = () => {
    await supabase.auth.signOut();
    navigate("/");
  };

const handleDownloadResume = async (resume, format = 'json') => {
  if (format === 'json') {
    const content = JSON.stringify(resume, null, 2)
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${resume.title}.json`
    a.click()
    URL.revokeObjectURL(url)
  } else if (format === 'pdf') {
    // Import jsPDF at top of file
    const { default: jsPDF } = await import('jspdf')
    const doc = new jsPDF()
    
    const content = resume.content_json
    const { personal = {}, experiences = [], educations = [], skills = {}, summary = '' } = content
    
    let y = 20
    
    // Header
    doc.setFontSize(20)
    doc.setFont(undefined, 'bold')
    doc.text(personal.fullName || 'Resume', 105, y, { align: 'center' })
    y += 8
    
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    const contactLine = [personal.email, personal.phone, personal.location].filter(Boolean).join(' | ')
    doc.text(contactLine, 105, y, { align: 'center' })
    y += 15
    
    // Summary
    if (summary) {
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('PROFESSIONAL SUMMARY', 20, y)
      y += 7
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      const lines = doc.splitTextToSize(summary, 170)
      doc.text(lines, 20, y)
      y += lines.length * 5 + 10
    }
    
    // Experience
    if (experiences.length > 0) {
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('WORK EXPERIENCE', 20, y)
      y += 7
      
      experiences.forEach(exp => {
        if (y > 270) { doc.addPage(); y = 20 }
        doc.setFontSize(11)
        doc.setFont(undefined, 'bold')
        doc.text(exp.role || '', 20, y)
        y += 5
        doc.setFontSize(10)
        doc.setFont(undefined, 'italic')
        doc.text(`${exp.company || ''} | ${exp.startDate || ''} - ${exp.current ? 'Present' : exp.endDate || ''}`, 20, y)
        y += 5
        doc.setFont(undefined, 'normal')
        if (exp.bullets) {
          const bullets = exp.bullets.split('\n').filter(b => b.trim())
          bullets.forEach(bullet => {
            const lines = doc.splitTextToSize(bullet, 165)
            doc.text(lines, 25, y)
            y += lines.length * 5
          })
        }
        y += 5
      })
    }
    
    // Education
    if (educations.length > 0) {
      if (y > 250) { doc.addPage(); y = 20 }
      y += 5
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('EDUCATION', 20, y)
      y += 7
      
      educations.forEach(edu => {
        if (y > 270) { doc.addPage(); y = 20 }
        doc.setFontSize(11)
        doc.setFont(undefined, 'bold')
        doc.text(`${edu.degree || ''} in ${edu.field || ''}`, 20, y)
        y += 5
        doc.setFontSize(10)
        doc.setFont(undefined, 'italic')
        doc.text(`${edu.institution || ''} | ${edu.year || ''}`, 20, y)
        y += 7
      })
    }
    
    // Skills
    if (skills.technical || skills.soft) {
      if (y > 250) { doc.addPage(); y = 20 }
      y += 5
      doc.setFontSize(12)
      doc.setFont(undefined, 'bold')
      doc.text('SKILLS', 20, y)
      y += 7
      doc.setFontSize(10)
      doc.setFont(undefined, 'normal')
      if (skills.technical) {
        doc.text(`Technical: ${skills.technical}`, 20, y)
        y += 5
      }
      if (skills.soft) {
        doc.text(`Soft Skills: ${skills.soft}`, 20, y)
        y += 5
      }
    }
    
    doc.save(`${resume.title}.pdf`)
  }
};

  const handleDownloadCoverLetter = (letter) => {
    const fileData =
      letter.content || letter.body || JSON.stringify(letter, null, 2);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${letter.job_title || "cover-letter"}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };
  const handleUpdateProfile = async () => {
  setUpdateError('')
  if (!updateForm.name.trim() && !updateForm.email.trim()) {
    setUpdateError('Provide at least one field')
    return
  }
  
  try {
    const res = await updateProfile({ 
      full_name: updateForm.name || undefined, 
      email: updateForm.email || undefined 
    })
    setUser({ ...user, name: res.user.name, email: res.user.email })
    setShowUpdateModal(false)
    alert('Profile updated successfully!')
  } catch (err) {
    setUpdateError(err.message)
  }
}

const handleChangePassword = async () => {
  setPasswordError('')
  if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
    setPasswordError('All fields are required')
    return
  }
  if (passwordForm.new.length < 6) {
    setPasswordError('New password must be at least 6 characters')
    return
  }
  if (passwordForm.new !== passwordForm.confirm) {
    setPasswordError('Passwords do not match')
    return
  }
  
  try {
    await changePassword({ currentPassword: passwordForm.current, newPassword: passwordForm.new })
    setShowPasswordModal(false)
    setPasswordForm({ current: '', new: '', confirm: '' })
    alert('Password changed successfully!')
  } catch (err) {
    setPasswordError(err.message)
  }
}

  const handleDeleteResume = async (id) => {
    try {
      await deleteResume(id);
      setResumes((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete resume");
    }
  };

  const handleDeleteCoverLetter = async (id) => {
    try {
      await deleteCoverLetter(id);
      setCoverLetters((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete cover letter");
    }
  };

  // ── Loading Screen ───────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-slate-200 p-10 shadow-lg text-center max-w-sm">
          <div className="animate-spin h-10 w-10 border-4 border-blue-700 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-700 font-semibold">
            Loading your workspace...
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Please wait — server may be waking up
          </p>
          <p className="text-slate-300 text-xs mt-3">
            ⏱️ First load can take up to 60 seconds on free tier
          </p>
        </div>
      </div>
    );
  }

  // ── Null guard ───────────────────────────────────────────
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* ── NAVBAR ── */}
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/home")}
          >
            <div className="w-8 h-8 bg-blue-700 rounded-md"></div>
            <span className="text-xl font-bold text-blue-800 tracking-tight">
              CareerCraft AI
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600">
            {[
              { label: "Home", route: "/home" },
              { label: "Resume", route: "/resume/new" },
              { label: "Cover Letter", route: "/cover-letter/new" },
              { label: "ATS Score", route: "/ats-score" },
              { label: "About Us", route: "/about" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.route)}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 transition"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* User + Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-9 h-9 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.name.charAt(0)}
              </div>
              <span className="text-sm font-semibold text-slate-700">
                {user.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="hidden sm:block px-4 py-2 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
            >
              Logout
            </button>
            {/* Mobile hamburger */}
            <button
              className="sm:hidden text-slate-600"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="sm:hidden bg-white border-t border-slate-100 px-6 py-4 flex flex-col gap-3 text-sm">
            <button
              onClick={() => navigate("/home")}
              className="text-left hover:text-blue-700"
            >
              Home
            </button>
            <button
              onClick={() => navigate("/resume/new")}
              className="text-left hover:text-blue-700"
            >
              Resume
            </button>
            <button
              onClick={() => navigate("/cover-letter/new")}
              className="text-left hover:text-blue-700"
            >
              Cover Letter
            </button>
            <button
              onClick={() => navigate("/ats-score")}
              className="text-left hover:text-blue-700"
            >
              ATS Score
            </button>
            <button
              onClick={() => navigate("/about")}
              className="text-left hover:text-blue-700"
            >
              About Us
            </button>
            <button onClick={handleLogout} className="text-left text-red-600">
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* ── MAIN ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 space-y-8">
        {/* Error Banner */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700 flex items-center gap-2">
            ⚠️ {error}
          </div>
        )}

        {/* Hero Banner */}
        <section className="rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white p-8 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-blue-200 mb-2">
                Dashboard
              </p>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-blue-200 text-sm">
                Manage your resumes, cover letters, ATS scores and account from
                here.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Resumes", value: resumes.length },
                { label: "Cover Letters", value: coverLetters.length },
                { label: "ATS Checks", value: atsHistory.length },
              ].map((s, i) => (
                <div key={i} className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-blue-200 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TABS ── */}
        <div className="flex gap-2 border-b border-slate-200">
          {[
            { key: "resumes", label: "📄 Resumes" },
            { key: "coverletters", label: "✉️ Cover Letters" },
            { key: "ats", label: "🎯 ATS History" },
            { key: "account", label: "👤 Account" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-semibold rounded-t-lg transition border-b-2
                ${
                  activeTab === tab.key
                    ? "border-blue-700 text-blue-700 bg-white"
                    : "border-transparent text-slate-500 hover:text-blue-600"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB: RESUMES ── */}
        {activeTab === "resumes" && (
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Saved Resumes
                </h2>
                <p className="text-sm text-slate-500">
                  Edit, download or delete your resumes
                </p>
              </div>
              <button
                onClick={() => navigate("/resume/new")}
                className="px-4 py-2 bg-blue-700 text-white text-sm font-bold rounded-lg hover:bg-blue-800 transition"
              >
                + New Resume
              </button>
            </div>

            {resumes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-5xl mb-3">📄</div>
                <p className="font-semibold text-slate-700">No resumes yet</p>
                <p className="text-sm text-slate-400 mt-1 mb-5">
                  Create your first AI-powered resume in minutes
                </p>
                <button
                  onClick={() => navigate("/resume/new")}
                  className="px-6 py-2 bg-blue-700 text-white text-sm font-bold rounded-lg hover:bg-blue-800 transition"
                >
                  Build Resume
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-slate-700">
                  <thead className="border-b border-slate-200 text-slate-500 text-left">
                    <tr>
                      <th className="px-4 py-3">Resume Title</th>
                      <th className="px-4 py-3">Last Updated</th>
                      <th className="px-4 py-3">ATS Score</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumes.map((resume) => (
                      <tr
                        key={resume.id}
                        className="border-b border-slate-100 hover:bg-slate-50 transition"
                      >
                        <td className="px-4 py-4 font-semibold text-slate-900">
                          {resume.title}
                        </td>
                        <td className="px-4 py-4 text-slate-500">
                          {resume.updated_at || resume.created_at}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold
                            ${
                              (resume.ats_score ?? 0) >= 70
                                ? "bg-green-100 text-green-700"
                                : (resume.ats_score ?? 0) >= 40
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {resume.ats_score ?? 0}%
                          </span>
                        </td>
                        <td className="px-4 py-4 flex gap-2">
                          <button
                            onClick={() =>
                              navigate(`/resume/edit/${resume.id}`)
                            }
                            className="px-3 py-1 text-xs font-semibold border border-slate-200 rounded-lg hover:bg-slate-100 transition"
                          >
                            Edit
                          </button>

<div className="relative group">
  <button
    className="px-3 py-1 text-xs font-semibold border border-slate-200 rounded-lg hover:bg-slate-100 transition">
    Download ▼
  </button>
  <div className="hidden group-hover:block absolute right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[120px]">
    <button
      onClick={() => handleDownloadResume(resume, 'pdf')}
      className="block w-full text-left px-4 py-2 text-xs hover:bg-slate-50">
      📄 PDF
    </button>
    <button
      onClick={() => handleDownloadResume(resume, 'json')}
      className="block w-full text-left px-4 py-2 text-xs hover:bg-slate-50">
      📋 JSON
    </button>
  </div>
</div>
                          <button
                            onClick={() => handleDeleteResume(resume.id)}
                            className="px-3 py-1 text-xs font-semibold border border-red-200 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {/* ── TAB: COVER LETTERS ── */}
        {activeTab === "coverletters" && (
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Saved Cover Letters
                </h2>
                <p className="text-sm text-slate-500">
                  Manage your tailored cover letters
                </p>
              </div>
              <button
                onClick={() => navigate("/cover-letter/new")}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition"
              >
                + New Cover Letter
              </button>
            </div>

            {coverLetters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-5xl mb-3">✉️</div>
                <p className="font-semibold text-slate-700">
                  No cover letters yet
                </p>
                <p className="text-sm text-slate-400 mt-1 mb-5">
                  Generate a tailored cover letter for any job in seconds
                </p>
                <button
                  onClick={() => navigate("/cover-letter/new")}
                  className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition"
                >
                  Create Cover Letter
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {coverLetters.map((letter) => (
                  <div
                    key={letter.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {letter.job_title}
                      </p>
                      <p className="text-sm text-slate-500">
                        {letter.company_name} • {letter.created_at}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-xs font-semibold border border-slate-200 bg-white rounded-lg hover:bg-slate-100 transition">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDownloadCoverLetter(letter)}
                        className="px-3 py-1 text-xs font-semibold border border-slate-200 bg-white rounded-lg hover:bg-slate-100 transition"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handleDeleteCoverLetter(letter.id)}
                        className="px-3 py-1 text-xs font-semibold border border-red-200 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── TAB: ATS HISTORY ── */}
        {activeTab === "ats" && (
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                ATS Score History
              </h2>
              <p className="text-sm text-slate-500">
                Track your resume performance over time
              </p>
            </div>

            {atsHistory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-5xl mb-3">🎯</div>
                <p className="font-semibold text-slate-700">
                  No ATS checks yet
                </p>
                <p className="text-sm text-slate-400 mt-1 mb-5">
                  Check how well your resume matches a job description
                </p>
                <button
                  onClick={() => navigate("/ats-score")}
                  className="px-6 py-2 bg-yellow-500 text-white text-sm font-bold rounded-lg hover:bg-yellow-600 transition"
                >
                  Check ATS Score
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {atsHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4 flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {entry.job}
                      </p>
                      <p className="text-sm text-slate-500">{entry.date}</p>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold
                      ${
                        entry.score >= 70
                          ? "bg-green-100 text-green-700"
                          : entry.score >= 40
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {entry.score}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── TAB: ACCOUNT ── */}
        {activeTab === "account" && (
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-xl">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-slate-900">
                Account & Profile
              </h2>
              <p className="text-sm text-slate-500">
                Your account details and preferences
              </p>
			  <div className="flex flex-col items-center mb-6 mt-6">
  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden mb-3">
    {user.profile_picture_url ? (
      <img
        src={user.profile_picture_url}
        alt={user.name}
        className="w-full h-full object-cover"
      />
    ) : (
      <span className="text-3xl font-bold text-blue-700">
        {user.name.charAt(0)}
      </span>
    )}
  </div>

  <label className="cursor-pointer px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200 transition">
    {uploading ? "Uploading..." : "Change Photo"}

    <input
      type="file"
      accept="image/*"
      onChange={handleProfilePictureUpload}
      className="hidden"
      disabled={uploading}
    />
  </label>
</div>
            </div>
            <div className="space-y-5">
              {[
                { label: "Full Name", value: user.name },
                { label: "Email", value: user.email },
                { label: "Member Since", value: user.memberSince },
                { label: "Account Type", value: user.role },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border-b border-slate-100 pb-4"
                >
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {item.value}
                  </p>
                </div>
              ))}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
<button 
  type="button" 
  onClick={() => {
    setUpdateForm({ name: user.name, email: user.email })
    setShowUpdateModal(true)
  }}
  className="w-full rounded-2xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 transition">
  Update Profile
</button>
<button 
  type="button" 
  onClick={() => setShowPasswordModal(true)}
  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition">
  Change Password
</button>
              </div>

 {/* May be we need to update this in future */}

            {/* Update Profile Modal */}
{showUpdateModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Update Profile</h3>
      
      {updateError && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{updateError}</div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            value={updateForm.name}
            onChange={e => setUpdateForm({ ...updateForm, name: e.target.value })}
            placeholder={user.name}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
          <input
            type="email"
            value={updateForm.email}
            onChange={e => setUpdateForm({ ...updateForm, email: e.target.value })}
            placeholder={user.email}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setShowUpdateModal(false)}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50">
          Cancel
        </button>
        <button
          onClick={handleUpdateProfile}
          className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800">
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}

{/* Change Password Modal */}
{showPasswordModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
      <h3 className="text-xl font-bold text-slate-900 mb-4">Change Password</h3>
      
      {passwordError && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">{passwordError}</div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Current Password</label>
          <input
            type="password"
            value={passwordForm.current}
            onChange={e => setPasswordForm({ ...passwordForm, current: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">New Password</label>
          <input
            type="password"
            value={passwordForm.new}
            onChange={e => setPasswordForm({ ...passwordForm, new: e.target.value })}
            placeholder="Min. 6 characters"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Confirm New Password</label>
          <input
            type="password"
            value={passwordForm.confirm}
            onChange={e => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
          />
        </div>
      </div>
      
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => {
            setShowPasswordModal(false)
            setPasswordForm({ current: '', new: '', confirm: '' })
            setPasswordError('')
          }}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-semibold hover:bg-slate-50">
          Cancel
        </button>
        <button
          onClick={handleChangePassword}
          className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800">
          Change Password
        </button>
      </div>
    </div>
  </div>
)}
            </div>
          </section>
        )}
      </main>

      {/* ── FOOTER ── */}
         <Footer />
    </div>
  );
}
}
