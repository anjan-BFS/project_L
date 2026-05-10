import { useNavigate } from 'react-router-dom'

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="bg-white border-t border-gray-200 py-5 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-700 rounded"></div>
          <span className="font-semibold text-gray-600">CareerCraft AI</span>
        </div>
        
        <div className="flex gap-5">
          <button onClick={() => navigate('/about')} className="hover:text-blue-600 transition">
            About Us
          </button>
          <button onClick={() => navigate('/terms')} className="hover:text-blue-600 transition">
            Terms
          </button>
          <button onClick={() => navigate('/privacy')} className="hover:text-blue-600 transition">
            Privacy
          </button>
          {/* <button onClick={() => navigate('/dashboard')} className="hover:text-blue-600 transition">
            Dashboard
          </button> */}
        </div>
        
        <span>© {new Date().getFullYear()} CareerCraft AI. All rights reserved.</span>
      </div>
    </footer>
  )
}