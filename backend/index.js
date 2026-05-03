const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { createClient } = require('@supabase/supabase-js')

dotenv.config()

const app = express()
const port = process.env.PORT || 4000
const JWT_SECRET = process.env.JWT_SECRET || 'please-change-this-secret'

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.warn('Warning: SUPABASE_URL or SUPABASE_KEY is not set in .env')
}

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set in .env; using default insecure secret')
}

app.use(cors())
app.use(express.json())

const supabase = createClient(process.env.SUPABASE_URL || '', process.env.SUPABASE_KEY || '')

const createToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
}

const validateAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.replace('Bearer ', '').trim()

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    return next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Missing name, email, or password' })
  }

  const { data: existingUser, error: existingError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (existingError && existingError.code !== 'PGRST116') {
    return res.status(500).json({ error: existingError.message })
  }

  if (existingUser) {
    return res.status(409).json({ error: 'Email already registered' })
  }

  const password_hash = await bcrypt.hash(password, 10)
  const { data, error } = await supabase
    .from('users')
    .insert({ email, password_hash, full_name: name })
    .select('id,email,full_name,created_at')
    .single()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  const token = createToken(data)
  return res.status(201).json({ token, user: { id: data.id, email: data.email, name: data.full_name, created_at: data.created_at } })
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' })
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('id,email,full_name,password_hash')
    .eq('email', email)
    .single()

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const passwordMatch = await bcrypt.compare(password, user.password_hash)
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const token = createToken(user)
  return res.json({ token, user: { id: user.id, email: user.email, name: user.full_name } })
})

app.get('/api/user/profile', validateAuth, async (req, res) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('id,email,full_name,created_at')
    .eq('id', req.user.id)
    .single()

  if (error || !user) {
    return res.status(404).json({ error: 'User not found' })
  }

  return res.json({ id: user.id, email: user.email, name: user.full_name, memberSince: user.created_at })
})

app.post('/api/resume/create', validateAuth, async (req, res) => {
  const { title, content_json, ats_score } = req.body
  if (!title || !content_json) {
    return res.status(400).json({ error: 'Resume title and content_json are required' })
  }

  const { data, error } = await supabase
    .from('resumes')
    .insert({
      user_id: req.user.id,
      title,
      content_json,
      ats_score: ats_score || null,
      updated_at: new Date().toISOString(),
    })
    .select('id,title,ats_score,created_at,updated_at')
    .single()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(201).json({ message: 'Resume created', resume: data })
})

app.get('/api/resume/list', validateAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('resumes')
    .select('id,title,ats_score,created_at,updated_at')
    .eq('user_id', req.user.id)
    .order('updated_at', { ascending: false })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.json({ resumes: data })
})

app.put('/api/resume/:id', validateAuth, async (req, res) => {
  const { id } = req.params
  const updates = { ...req.body, updated_at: new Date().toISOString() }

  const { data, error } = await supabase
    .from('resumes')
    .update(updates)
    .eq('id', id)
    .eq('user_id', req.user.id)
    .select('id,title,ats_score,created_at,updated_at')
    .single()

  if (error || !data) {
    return res.status(404).json({ error: error?.message || 'Resume not found' })
  }

  return res.json({ message: 'Resume updated', resume: data })
})

app.delete('/api/resume/:id', validateAuth, async (req, res) => {
  const { id } = req.params
  const { error } = await supabase
    .from('resumes')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.json({ message: 'Resume deleted' })
})

app.post('/api/coverletter/create', validateAuth, async (req, res) => {
  const { job_title, company_name, content } = req.body
  if (!job_title || !company_name || !content) {
    return res.status(400).json({ error: 'job_title, company_name, and content are required' })
  }

  const { data, error } = await supabase
    .from('cover_letters')
    .insert({ user_id: req.user.id, job_title, company_name, content })
    .select('id,job_title,company_name,content,created_at')
    .single()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(201).json({ message: 'Cover letter created', coverLetter: data })
})

app.get('/api/coverletter/list', validateAuth, async (req, res) => {
  const { data, error } = await supabase
    .from('cover_letters')
    .select('id,job_title,company_name,content,created_at')
    .eq('user_id', req.user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.json({ coverLetters: data })
})

app.post('/api/ai/generate-resume', validateAuth, async (req, res) => {
  return res.json({ generatedResume: 'Generated resume content placeholder' })
})

app.post('/api/ai/generate-cover', validateAuth, async (req, res) => {
  return res.json({ generatedCoverLetter: 'Generated cover letter content placeholder' })
})

app.post('/api/ai/ats-score', validateAuth, async (req, res) => {
  const { resumeText, jobDescription } = req.body
  if (!resumeText || !jobDescription) {
    return res.status(400).json({ error: 'Resume text and job description are required' })
  }

  return res.json({
    atsScore: 84,
    summary: 'Your resume is well-formatted, but add more keywords from the job description.',
  })
})

app.delete('/api/coverletter/:id', validateAuth, async (req, res) => {
  const { id } = req.params
  const { error } = await supabase
    .from('cover_letters')
    .delete()
    .eq('id', id)
    .eq('user_id', req.user.id)

  if (error) {
    return res.status(500).json({ error: error.message })
  }
  return res.json({ message: 'Cover letter deleted' })
})


// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Keep-alive ping to prevent Render sleep
setInterval(() => {
  fetch(`https://project-l-jxf5.onrender.com/health`)
    .then(() => console.log('Keep-alive ping sent'))
    .catch(() => console.log('Keep-alive ping failed'))
}, 14 * 60 * 1000) // every 14 minutes

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`)
})

