import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// ── TYPEWRITER COMPONENT ──
function TypewriterText() {
  const phrases = [
    'AI-Optimized Resumes',
    'Professional Portfolios',
    'Interview Success',
    'Dream Jobs',
  ]
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const phrase = phrases[currentPhrase]
    const speed = isDeleting ? 30 : 50

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayedText.length < phrase.length) {
          setDisplayedText(phrase.substring(0, displayedText.length + 1))
        } else {
          setTimeout(() => setIsDeleting(true), 1500)
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(phrase.substring(0, displayedText.length - 1))
        } else {
          setIsDeleting(false)
          setCurrentPhrase((prev) => (prev + 1) % phrases.length)
        }
      }
    }, speed)

    return () => clearTimeout(timer)
  }, [displayedText, isDeleting, currentPhrase])

  return (
    <span className="text-yellow-300 min-h-[1.2em]">
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

// ── SCROLL REVEAL COMPONENT ──
function ScrollReveal({ children, delay = 0 }) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}

// ── ANIMATED COUNTER COMPONENT ──
function AnimatedCounter({ end, label }) {
  const ref = useRef(null)
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const duration = 2000 // 2 seconds
    const startTime = Date.now()

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      setCount(Math.floor(end * progress))

      if (progress === 1) {
        clearInterval(interval)
      }
    }, 16) // ~60fps

    return () => clearInterval(interval)
  }, [isVisible, end])

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl font-extrabold text-yellow-300">
        {count}
        {end > 100 ? '+' : ''}
      </div>
      <div className="text-sm text-blue-200 mt-1">{label}</div>
    </div>
  )
}

// ── MOUSE GLOW EFFECT COMPONENT ──
function GlowCard({ children }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const ref = useRef(null)

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition overflow-hidden group"
    >
      <div
        className="absolute pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        style={{
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.5) 0%, transparent 70%)',
          left: `${mousePosition.x - 100}px`,
          top: `${mousePosition.y - 100}px`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

// ── AI ORB COMPONENT ──
function AIOrb() {
  return (
    <div className="relative w-full h-96 flex items-center justify-center">
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full filter blur-3xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: 'mirror',
        }}
      />

      {/* Rotating outer ring */}
      <motion.div
        className="absolute w-64 h-64 border-2 border-blue-300 rounded-full opacity-40"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-300 rounded-full" />
      </motion.div>

      {/* Middle rotating ring (opposite direction) */}
      <motion.div
        className="absolute w-48 h-48 border-2 border-purple-300 rounded-full opacity-30"
        animate={{
          rotate: -360,
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Central glowing orb */}
      <motion.div
        className="relative w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-2xl"
        animate={{
          boxShadow: [
            '0 0 40px rgba(59, 130, 246, 0.5)',
            '0 0 80px rgba(168, 85, 247, 0.7)',
            '0 0 40px rgba(59, 130, 246, 0.5)',
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'mirror',
        }}
      >
        {/* Inner light effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-20 rounded-full" />
        {/* Center AI symbol */}
        <div className="absolute inset-0 flex items-center justify-center text-white text-3xl font-bold">
          ✨
        </div>
      </motion.div>

      {/* Floating particles around orb */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-300 rounded-full"
          animate={{
            x: Math.cos((i * Math.PI) / 2) * 120,
            y: Math.sin((i * Math.PI) / 2) * 120,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: 'mirror',
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const [navigationLoading, setNavigationLoading] = useState(false)

  // Page tracking
  useEffect(() => {
    console.log('Landing Page Loaded')
    // Add your analytics tracking here if needed
    // Example: analytics.track('landing_page_view')
  }, [])

  const handleNavigation = (path) => {
    setNavigationLoading(true)
    setTimeout(() => {
      navigate(path)
      setNavigationLoading(false)
    }, 300)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* ── HERO SECTION WITH AI ORB ── */}
      <section className="bg-gradient-to-br from-blue-800 to-blue-600 text-white py-24 px-6 relative overflow-hidden">
        {/* Animated background gradient blobs */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'mirror',
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'mirror',
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="flex flex-col justify-center">
              <motion.span
                className="inline-block bg-blue-500 text-white text-xs font-semibold px-4 py-1 rounded-full mb-6 tracking-widest uppercase w-fit"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                AI Powered Career Tools
              </motion.span>

              <motion.h1
                className="text-5xl font-extrabold leading-tight mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
              >
                Build a Resume That <br />
                <TypewriterText />
              </motion.h1>

              <motion.p
                className="text-lg text-blue-100 mb-10 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Create professional, ATS-optimized resumes and cover letters in minutes
                using the power of AI. Stand out from the crowd and land your dream job.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <motion.button
                  onClick={() => handleNavigation('/register')}
                  disabled={navigationLoading}
                  aria-label="Get started with free resume builder"
                  className="px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold rounded-lg text-base shadow-lg transition w-fit disabled:opacity-60"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {navigationLoading ? 'Loading...' : "Get Started — It's Free"}
                </motion.button>
                <motion.button
                  onClick={() => handleNavigation('/login')}
                  disabled={navigationLoading}
                  aria-label="Sign in to your account"
                  className="px-8 py-4 bg-white hover:bg-blue-50 text-blue-800 font-bold rounded-lg text-base shadow-lg transition w-fit disabled:opacity-60"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {navigationLoading ? 'Loading...' : 'Sign In to Your Account'}
                </motion.button>
              </motion.div>
            </div>

            {/* Right: AI Orb */}
            <motion.div
              className="hidden lg:flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <AIOrb />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ANIMATED STATS BAR ── */}
      <section className="bg-blue-900 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          <AnimatedCounter end={10000} label="Resumes Created" />
          <AnimatedCounter end={95} label="ATS Pass Rate %" />
          <AnimatedCounter end={500} label="Job Categories" />
          <div className="text-center">
            <div className="text-3xl font-extrabold text-yellow-300">4.9★</div>
            <div className="text-sm text-blue-200 mt-1">User Rating</div>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION WITH SCROLL REVEAL ── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-blue-900 mb-3">
                Everything You Need to Land the Job
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Our AI-powered platform gives you professional tools that were once
                only available to career coaches.
              </p>
            </div>
          </ScrollReveal>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {[
              {
                icon: '📄',
                title: 'Build Resume',
                desc: 'Create a polished, professional resume with AI-generated content tailored to your industry.',
                action: 'Build Resume →',
                route: '/register',
                ariaLabel: 'Navigate to resume builder',
              },
              {
                icon: '✉️',
                title: 'Cover Letter',
                desc: 'Generate a compelling, personalized cover letter for any job in seconds.',
                action: 'Build Cover Letter →',
                route: '/register',
                ariaLabel: 'Navigate to cover letter builder',
              },
              {
                icon: '🎯',
                title: 'ATS Score',
                desc: 'Check how well your resume matches a job description and get actionable suggestions.',
                action: 'Check ATS Score →',
                route: '/login',
                ariaLabel: 'Navigate to ATS score checker',
              },
            ].map((feature, i) => (
              <motion.div key={i} variants={itemVariants}>
                <GlowCard>
                  <div className="text-4xl mb-4" aria-hidden="true">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-blue-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{feature.desc}</p>
                  <motion.button
                    onClick={() => handleNavigation(feature.route)}
                    aria-label={feature.ariaLabel}
                    className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
                    whileHover={{ x: 5 }}
                  >
                    {feature.action}
                  </motion.button>
                </GlowCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS (TIMELINE) ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-blue-900 mb-3">How It Works</h2>
              <p className="text-gray-500">Three simple steps to your perfect resume</p>
            </div>
          </ScrollReveal>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center relative"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Animated connecting line (desktop only) */}
            <motion.div
              className="hidden sm:block absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{ originX: 0 }}
            />

            {[
              {
                step: '01',
                title: 'Create Account',
                desc: 'Sign up for free in under 60 seconds. No credit card required.',
              },
              {
                step: '02',
                title: 'Enter Your Details',
                desc: 'Fill in your experience, skills and job target. AI does the rest.',
              },
              {
                step: '03',
                title: 'Download & Apply',
                desc: 'Export your resume as PDF or DOCX and start applying immediately.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center relative"
                variants={itemVariants}
              >
                <motion.div
                  className="w-16 h-16 rounded-full bg-blue-700 text-white flex items-center justify-center text-xl font-extrabold mb-4 shadow-md border-4 border-white relative z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-hidden="true"
                >
                  {item.step}
                </motion.div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PREMIUM CTA SECTION ── */}
      <section className="relative py-20 px-6 overflow-hidden">
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        {/* Floating animated blobs */}
        <motion.div
          className="absolute top-20 left-10 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"
          animate={{
            y: [0, -30, 0],
            x: [0, -20, 0],
          }}
          transition={{ duration: 7, repeat: Infinity }}
        />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.h2
            className="text-4xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Ready to Build Your Professional Resume?
          </motion.h2>
          <motion.p
            className="text-blue-200 mb-8 text-base"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Join thousands of job seekers who have already landed their dream jobs
            using CareerCraft AI.
          </motion.p>
          <motion.button
            onClick={() => handleNavigation('/register')}
            disabled={navigationLoading}
            aria-label="Get started with free account"
            className="px-10 py-4 bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold rounded-lg text-lg shadow-lg transition disabled:opacity-60"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            {navigationLoading ? 'Loading...' : 'Get Started Free'}
          </motion.button>
        </div>
      </section>

      <Footer />
    </div>
  )
}