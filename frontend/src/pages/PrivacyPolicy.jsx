import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-blue-900 mb-6">Privacy Policy</h1>

        <div className="bg-white rounded-xl border border-gray-100 p-8 prose prose-sm max-w-none">
          <p className="text-gray-500 text-sm mb-6">Last updated: May 3, 2026</p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Information We Collect</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We collect information you provide when creating an account, such as your name and email address. We also store profile data and usage details to improve your experience.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. How We Use Your Data</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            CareerCraft AI uses your information to personalize your account, store your resume and cover letter content, and deliver the best service.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Sharing & Security</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            We do not sell your data. We share information only when required by law or with trusted service providers who help us operate the platform.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Your Rights</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            You can update or delete your account information through the dashboard. Contact support if you have questions about your privacy rights.
          </p>

          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">5. Contact</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have privacy questions, please contact us at support@careercraft.ai.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
