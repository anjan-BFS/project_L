import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import CoverLetterBuilder from './pages/CoverLetterBuilder'
import ATSScore from './pages/ATSScore'
import AboutUs from './pages/AboutUs'
import ForgotPassword from './pages/ForgotPassword'
import TermsOfService from './pages/TermsOfService'
import PrivacyPolicy from './pages/PrivacyPolicy'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/"                 element={<LandingPage />} />
      <Route path="/login"            element={<Login />} />
      <Route path="/register"         element={<Register />} />
      <Route path="/about"            element={<AboutUs />} />
      <Route path="/forgot-password"  element={<ForgotPassword />} />
      <Route path="/terms"            element={<TermsOfService />} />
      <Route path="/privacy"          element={<PrivacyPolicy />} />

      {/* Protected Routes - Only one entry per path! */}
      <Route path="/home"             element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/dashboard"        element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/resume/new"       element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
      <Route path="/resume/edit/:id"  element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
      <Route path="/cover-letter/new" element={<ProtectedRoute><CoverLetterBuilder /></ProtectedRoute>} />
      <Route path="/ats-score"        element={<ProtectedRoute><ATSScore /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
