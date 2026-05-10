import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register, saveToken } from "../utils/api";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
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
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!agreed) {
      newErrors.agreed = "You must agree to the terms";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
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
      const response = await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      // saveToken(response.token);
      navigate("/dashboard");
    } catch (error) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Password strength checker
  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return null;
    if (p.length < 6)
      return { label: "Weak", color: "bg-red-400", width: "w-1/4" };
    if (p.length < 8)
      return { label: "Fair", color: "bg-yellow-400", width: "w-2/4" };
    if (!/[A-Z]/.test(p) || !/[0-9]/.test(p))
      return { label: "Good", color: "bg-blue-400", width: "w-3/4" };
    return { label: "Strong", color: "bg-green-500", width: "w-full" };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── NAVBAR ── */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 bg-blue-700 rounded-md"></div>
            <span className="text-xl font-bold text-blue-800 tracking-tight">
              CareerCraft AI
            </span>
          </div>
          <div className="text-sm text-gray-500">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-700 font-semibold hover:underline"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* ── REGISTER FORM ── */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-blue-700 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">C</span>
              </div>
              <h1 className="text-2xl font-bold text-blue-900">
                Create Your Account
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Join CareerCraft AI — it's completely free
              </p>
            </div>

            {serverError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
                {serverError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Smith"
                  className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition
                    ${
                      errors.fullName
                        ? "border-red-400 bg-red-50 focus:border-red-500"
                        : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                )}
              </div>

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
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition
                    ${
                      errors.password
                        ? "border-red-400 bg-red-50 focus:border-red-500"
                        : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                />
                {/* Password Strength Bar */}
                {strength && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${strength.color} ${strength.width}`}
                      ></div>
                    </div>
                    <p
                      className={`text-xs mt-1 font-medium
                      ${strength.label === "Weak" ? "text-red-500" : ""}
                      ${strength.label === "Fair" ? "text-yellow-500" : ""}
                      ${strength.label === "Good" ? "text-blue-500" : ""}
                      ${strength.label === "Strong" ? "text-green-500" : ""}
                    `}
                    >
                      Password strength: {strength.label}
                    </p>
                  </div>
                )}
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition
                    ${
                      errors.confirmPassword
                        ? "border-red-400 bg-red-50 focus:border-red-500"
                        : formData.confirmPassword &&
                            formData.password === formData.confirmPassword
                          ? "border-green-400 bg-green-50"
                          : "border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }`}
                />
                {formData.confirmPassword &&
                  formData.password === formData.confirmPassword && (
                    <p className="text-green-500 text-xs mt-1">
                      ✓ Passwords match
                    </p>
                  )}
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => {
                      setAgreed(e.target.checked);
                      setErrors({ ...errors, agreed: "" });
                    }}
                    className="mt-0.5 w-4 h-4 accent-blue-700"
                  />
                  <span className="text-sm text-gray-600">
                    I agree to the{" "}
                    <span
                      onClick={() => navigate("/terms")}
                      className="text-blue-700 font-semibold hover:underline cursor-pointer"
                    >
                      Terms of Service
                    </span>{" "}
                    and{" "}
                    <span
                      onClick={() => navigate("/privacy")}
                      className="text-blue-700 font-semibold hover:underline cursor-pointer"
                    >
                      Privacy Policy
                    </span>
                  </span>
                </label>
                {errors.agreed && (
                  <p className="text-red-500 text-xs mt-1">{errors.agreed}</p>
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
                    Creating Account...
                  </span>
                ) : (
                  "Create Free Account"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-400 font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Google Register */}
            <button
              type="button"
              className="w-full py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-700 font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400 mt-6">
            © {new Date().getFullYear()} banerjee & co. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
