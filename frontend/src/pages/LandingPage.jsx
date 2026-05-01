import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── NAVBAR ── */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-700 rounded-md"></div>
            <span className="text-xl font-bold text-blue-800 tracking-tight">
              CareerCraft AI
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 text-sm font-semibold text-blue-700 border border-blue-700 rounded hover:bg-blue-50 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-5 py-2 text-sm font-semibold text-white bg-blue-700 rounded hover:bg-blue-800 transition"
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="bg-gradient-to-br from-blue-800 to-blue-600 text-white py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block bg-blue-500 text-white text-xs font-semibold px-4 py-1 rounded-full mb-6 tracking-widest uppercase">
            AI Powered Career Tools
          </span>
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Build a Resume That <br />
            <span className="text-yellow-300">Gets You Hired</span>
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-10">
            Create professional, ATS-optimized resumes and cover letters in minutes
            using the power of AI. Stand out from the crowd and land your dream job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold rounded-lg text-base shadow-lg transition"
            >
              Get Started — It's Free
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-white hover:bg-blue-50 text-blue-800 font-bold rounded-lg text-base shadow-lg transition"
            >
              Sign In to Your Account
            </button>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-blue-900 text-white py-8 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { number: "10,000+", label: "Resumes Created" },
            { number: "95%",     label: "ATS Pass Rate" },
            { number: "500+",    label: "Job Categories" },
            { number: "4.9★",    label: "User Rating" },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl font-extrabold text-yellow-300">{stat.number}</div>
              <div className="text-sm text-blue-200 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-blue-900 mb-3">
              Everything You Need to Land the Job
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Our AI-powered platform gives you professional tools that were once
              only available to career coaches.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "📄",
                title: "Build Resume",
                desc: "Create a polished, professional resume with AI-generated content tailored to your industry.",
                action: "Build Resume →",
                route: "/register",
              },
              {
                icon: "✉️",
                title: "Cover Letter",
                desc: "Generate a compelling, personalized cover letter for any job in seconds.",
                action: "Build Cover Letter →",
                route: "/register",
              },
              {
                icon: "🎯",
                title: "ATS Score",
                desc: "Check how well your resume matches a job description and get actionable suggestions.",
                action: "Check ATS Score →",
                route: "/register",
              },
              {
                icon: "📊",
                title: "Dashboard",
                desc: "Manage all your resumes, cover letters and track your ATS scores in one place.",
                action: "View Dashboard →",
                route: "/register",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-blue-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{feature.desc}</p>
                <button
                  onClick={() => navigate(feature.route)}
                  className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
                >
                  {feature.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-blue-900 mb-3">How It Works</h2>
            <p className="text-gray-500">Three simple steps to your perfect resume</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
            {[
              { step: "01", title: "Create Account", desc: "Sign up for free in under 60 seconds. No credit card required." },
              { step: "02", title: "Enter Your Details", desc: "Fill in your experience, skills and job target. AI does the rest." },
              { step: "03", title: "Download & Apply", desc: "Export your resume as PDF or DOCX and start applying immediately." },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-700 text-white flex items-center justify-center text-xl font-extrabold mb-4 shadow-md">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="bg-blue-800 text-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Build Your Professional Resume?
          </h2>
          <p className="text-blue-200 mb-8 text-base">
            Join thousands of job seekers who have already landed their dream jobs
            using CareerCraft AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold rounded-lg shadow-lg transition"
            >
              Create Free Account
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-blue-800 font-bold rounded-lg transition"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-blue-950 text-blue-300 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded"></div>
            <span className="text-white font-bold">CareerCraft AI</span>
          </div>
          <div className="flex gap-6 text-sm">
            <button onClick={() => navigate('/about')} className="hover:text-white transition">About Us</button>
            <button onClick={() => navigate('/login')} className="hover:text-white transition">Login</button>
            <button onClick={() => navigate('/register')} className="hover:text-white transition">Register</button>
          </div>
          <div className="text-xs text-blue-400">
            © {new Date().getFullYear()} banerjee & co. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  )
}