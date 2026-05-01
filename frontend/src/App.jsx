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

function App() {
  return (
    <Routes>
      <Route path="/"                 element={<LandingPage />} />
      <Route path="/login"            element={<Login />} />
      <Route path="/register"         element={<Register />} />
      <Route path="/home"             element={<Home />} />
      <Route path="/dashboard"        element={<Dashboard />} />
      <Route path="/resume/new"       element={<ResumeBuilder />} />
      <Route path="/cover-letter/new" element={<CoverLetterBuilder />} />
      <Route path="/ats-score"        element={<ATSScore />} />
      <Route path="/about"            element={<AboutUs />} />
    </Routes>
  )
}

export default App