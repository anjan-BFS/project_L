import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, saveToken, supabase } from "../utils/api";
import { signInWithGoogle } from "../utils/firebase";
import Footer from '../components/Footer'

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false)

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerError("");

    try {
      const response = await login(formData);
      // Save backend JWT (login() also saves it, but do it explicitly)
      if (response && response.token) saveToken(response.token)
      // Ensure Supabase client has the session for storage operations
      if (response && response.session) {
        await supabase.auth.setSession(response.session)
      }
      navigate("/dashboard");
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── NAVBAR ── */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 rounded-md overflow-hidden bg-white border border-slate-200 shadow-sm">
              <img src="/favicon.svg" alt="CareerCraft AI logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold text-blue-800 tracking-tight">
              CareerCraft AI
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-blue-700 font-semibold hover:underline"
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* ── LOGIN FORM ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-xl mx-auto mb-4 overflow-hidden bg-white border border-slate-100 flex items-center justify-center shadow-sm">
              <img src="/favicon.svg" alt="CareerCraft AI logo" className="w-10 h-10 object-contain" />
            </div>
              <h1 className="text-2xl font-bold text-blue-900">Welcome Back</h1>
              <p className="text-gray-500 text-sm mt-1">
                Sign in to your CareerCraft AI account
              </p>
            </div>
            {serverError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
                {serverError}
              </div>
            )}
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition
                    ${
                      errors.email
                        ? "border-red-400 bg-red-50 focus:border-red-500"
                        : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-3 pr-12 rounded-lg border text-sm outline-none transition
                      ${
                        errors.password
                          ? "border-red-400 bg-red-50 focus:border-red-500"
                          : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-5.838 1.834l-1.455-1.455zm4.261 4.261a3 3 0 112.83 4.879l-1.414-1.414a1.5 1.5 0 001.414-1.414l-1.83-1.051zM10 7a3 3 0 00-3 3v1.414l-1.414-1.414A1 1 0 104.586 11l2-2V10a1 1 0 011-1 1 1 0 011-1v-.586A1 1 0 1110 7z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-sm transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>
            {/* Google Login */}
            <button
              type="button"
              onClick={async () => {
                setGoogleLoading(true)
                try {
                  const { email, name, photoURL } = await signInWithGoogle()
                  
                  // Try to login first, if user doesn't exist, register them
                  try {
                    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/google`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email, name, photoURL })
                    })
                    const data = await res.json()
                    
                    if (res.ok) {
                      saveToken(data.token)
                      navigate('/home')
                    } else {
                      alert(data.error || 'Google login failed')
                    }
                  } catch (err) {
                    alert('Server error: ' + err.message)
                  }
                } catch (err) {
                  console.error('Google Sign-In Error:', err)
                  alert('Google login failed: ' + err.message)
                } finally {
                  setGoogleLoading(false)
                }
              }}
              disabled={googleLoading}
              className="w-full py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {googleLoading ? 'Signing in...' : 'Continue with Google'}
            </button>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="text-blue-700 font-semibold hover:underline"
              >
                Create one for free
              </button>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}