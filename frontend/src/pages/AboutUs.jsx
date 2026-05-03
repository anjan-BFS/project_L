import { useNavigate } from 'react-router-dom'

export default function AboutUs() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 lg:px-10 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-700 rounded-md"></div>
            <span className="text-lg font-bold text-blue-800">CareerCraft AI</span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="py-12 px-6 lg:px-10">
        <div className="max-w-6xl mx-auto space-y-10">
          <section className="rounded-3xl bg-white border border-slate-200 p-10 shadow-sm">
          <div className="max-w-3xl space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-700">
              About CareerCraft AI
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Empowering professionals with smarter resumes, cover letters, and career-ready tools.
            </h1>
            <p className="text-lg leading-8 text-slate-600">
              At CareerCraft AI, we believe every job seeker deserves an opportunity to shine. Our platform combines intelligent writing, resume optimization, and personalized workflow tools so you can build application materials that stand out — faster and with more confidence.
            </p>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-3">
          {[
            {
              title: 'Our Mission',
              description: 'Make career preparation simple, professional, and accessible for ambitious people everywhere.',
            },
            {
              title: 'Our Vision',
              description: 'A future where every candidate can showcase their skills with clarity and land the role they deserve.',
            },
            {
              title: 'Our Promise',
              description: 'Practical, easy-to-use tools backed by AI that help you create resumes and cover letters recruiters actually want to read.',
            },
          ].map((item) => (
            <div key={item.title} className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 mb-3">{item.title}</h2>
              <p className="text-slate-600 leading-7">{item.description}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl bg-white border border-slate-200 p-10 shadow-sm">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">Why CareerCraft AI?</h2>
              <p className="text-slate-600 leading-8">
                We built CareerCraft AI for people who want more than just a template. Our platform helps you:
              </p>
              <ul className="space-y-4 text-slate-600">
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-700"></span>
                  Create polished resumes and cover letters tailored to the job you want.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-700"></span>
                  Track resume ATS performance and improve your chance of getting noticed.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-700"></span>
                  Save and manage multiple application materials from one dashboard.
                </li>
              </ul>
            </div>
            <div className="rounded-3xl bg-blue-700 p-8 text-white shadow-xl">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold">Built for busy job seekers</h3>
                <p className="leading-7 text-slate-100">
                  Whether you are launching your career, changing industries, or pursuing a promotion, our tools help you create compelling application materials in minutes.
                </p>
                <div className="grid gap-4">
                  {[
                    'Fast resume generation',
                    'Editor for custom changes',
                    'Real ATS insights',
                  ].map((item) => (
                    <div key={item} className="rounded-2xl bg-white/10 p-4">
                      <p className="text-sm font-medium">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Our Values</h2>
            <div className="space-y-6 text-slate-600 leading-7">
              <div>
                <h3 className="font-semibold text-slate-900">Human-first technology</h3>
                <p>We use AI to assist, not replace. Every resume and letter should reflect the real person behind it.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Practical support</h3>
                <p>Our tools are built for real job-seeking challenges—not just flashy features.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Trust and transparency</h3>
                <p>We help you create materials you can be proud of, with clear guidance every step of the way.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">What we offer</h2>
            <ul className="space-y-4 text-slate-600 leading-7">
              <li>
                <strong className="text-slate-900">Resume builder</strong> with structured sections and easy editing.
              </li>
              <li>
                <strong className="text-slate-900">Cover letter creator</strong> that adapts to your target role.
              </li>
              <li>
                <strong className="text-slate-900">ATS scoring</strong> so you know how your resume performs before you apply.
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
    </div>
  )
}
