import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Terms of Service</h1>

        <div className="bg-white rounded-xl border border-gray-100 p-8 prose prose-sm max-w-none">
          <p className="text-gray-500 text-sm mb-6">Last updated: May 3, 2026</p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Acceptance of Terms</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            By accessing and using CareerCraft AI, you accept and agree to be bound by these Terms of Service.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Use of Service</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            CareerCraft AI provides AI-powered resume building, cover letter generation, and ATS scoring services. You agree to use the service only for lawful purposes.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. User Accounts</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Intellectual Property</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            All content you create using CareerCraft AI belongs to you. We retain the right to use anonymized data to improve our services.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">5. Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            CareerCraft AI is provided "as is" without warranties. We are not responsible for job application outcomes.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">6. Contact</h2>
          <p className="text-gray-700 leading-relaxed">
            For questions about these terms, contact us at: support@careercraft.ai
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
