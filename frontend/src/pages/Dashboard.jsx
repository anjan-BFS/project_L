import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearToken,
  getCoverLetters,
  getProfile,
  getResumes,
  deleteResume,
  deleteCoverLetter,
} from "../utils/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [coverLetters, setCoverLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("resumes");

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
    clearToken();
    navigate("/");
  };

  const handleDownloadResume = (resume) => {
    const fileData = JSON.stringify(resume, null, 2);
    const blob = new Blob([fileData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${resume.title || "resume"}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
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

                          <button
                            onClick={() => handleDownloadResume(resume)}
                            className="px-3 py-1 text-xs font-semibold border border-slate-200 rounded-lg hover:bg-slate-100 transition"
                          >
                            Download
                          </button>
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
                <button className="flex-1 py-2 bg-blue-700 text-white text-sm font-bold rounded-lg hover:bg-blue-800 transition">
                  Update Profile
                </button>
                <button className="flex-1 py-2 border border-slate-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-100 transition">
                  Change Password
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-slate-200 py-5 px-6 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-700 rounded"></div>
            <span className="font-semibold text-slate-600">CareerCraft AI</span>
          </div>
          <span>
            © {new Date().getFullYear()} CareerCraft AI. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
