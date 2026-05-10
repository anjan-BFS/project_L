import { createClient } from '@supabase/supabase-js'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'



const buildHeaders = (customHeaders = {}) => {
  const {
  data: { session },
} = await supabase.auth.getSession()

const token = session?.access_token
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.error || payload.message || 'Request failed')
  }
  return payload
}

const request = async (path, options) => {
  const response = await fetch(`${API_BASE_URL}${path}`, options)
  return parseResponse(response)
}

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
// ── Generic Methods ──────────────────────────────────────

export const apiGet = async (path) =>
  request(path, {
    method: 'GET',
    headers: await buildHeaders(),
  })

export const apiPost   = async (path, body) => request(path, { method: 'POST',   headers: await buildHeaders(), body: JSON.stringify(body) })
export const apiPut    = async (path, body) => request(path, { method: 'PUT',    headers: await buildHeaders(), body: JSON.stringify(body) })
export const apiDelete = async (path)        => request(path, { method: 'DELETE', headers: await buildHeaders() })

// ── Auth ─────────────────────────────────────────────────
export const login = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}
export const register = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    throw error
  }

  return data
}
// ── User ─────────────────────────────────────────────────
export const getProfile = () => apiGet('/api/user/profile')

// ── Resume ───────────────────────────────────────────────
export const getResumes    = ()          => apiGet('/api/resume/list')
export const createResume  = (body)      => apiPost('/api/resume/create', body)
export const updateResume  = (id, body)  => apiPut(`/api/resume/${id}`, body)
export const deleteResume  = (id)        => apiDelete(`/api/resume/${id}`)

// ── Cover Letter ─────────────────────────────────────────
export const getCoverLetters    = ()         => apiGet('/api/coverletter/list')
export const createCoverLetter  = (body)     => apiPost('/api/coverletter/create', body)
export const deleteCoverLetter  = (id)       => apiDelete(`/api/coverletter/${id}`)

// ── AI Endpoints ─────────────────────────────────────────
export const generateResume  = (body) => apiPost('/api/ai/generate-resume', body)
export const generateCover   = (body) => apiPost('/api/ai/generate-cover',  body)
export const getATSScore     = (body) => apiPost('/api/ai/ats-score',        body)

// Add these at the end:
export const updateProfile = (body) => apiPut('/api/user/profile', body)
export const changePassword = (body) => apiPost('/api/user/change-password', body)  

// Profile picture upload using Supabase Storage
export const uploadProfilePicture = async (file) => {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    throw new Error("Please login first")
  }

  const fileExt = file.name.split(".").pop()
  const fileName = `${session.user.id}-${Date.now()}.${fileExt}`

  const { error } = await supabase.storage
    .from("profile-pictures")
    .upload(fileName, file)

  if (error) {
    console.error(error)
    throw error
  }

  const { data } = supabase.storage
    .from("profile-pictures")
    .getPublicUrl(fileName)

  return data.publicUrl
}

export const updateProfilePicture = (photoURL) => apiPut('/api/user/profile', { profile_picture_url: photoURL })
await supabase.auth.signOut()