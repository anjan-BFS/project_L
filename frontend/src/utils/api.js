import { createClient } from '@supabase/supabase-js'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
const STORAGE_KEY = 'careerCraftToken'

// ── Token Management ─────────────────────────────────────
export const getToken   = () => localStorage.getItem(STORAGE_KEY)
export const saveToken  = (token) => localStorage.setItem(STORAGE_KEY, token)
export const clearToken = () => localStorage.removeItem(STORAGE_KEY)

// ── Supabase Client ──────────────────────────────────────
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// ── Headers Builder ──────────────────────────────────────
const buildHeaders = (customHeaders = {}) => {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

// ── Response Parser ──────────────────────────────────────
const parseResponse = async (response) => {
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.error || payload.message || 'Request failed')
  }
  return payload
}

// ── Generic Request ──────────────────────────────────────
const request = async (path, options) => {
  const response = await fetch(`${API_BASE_URL}${path}`, options)
  return parseResponse(response)
}

// ── Generic Methods ──────────────────────────────────────
export const apiGet    = (path)        => request(path, { method: 'GET',    headers: buildHeaders() })
export const apiPost   = (path, body)  => request(path, { method: 'POST',   headers: buildHeaders(), body: JSON.stringify(body) })
export const apiPut    = (path, body)  => request(path, { method: 'PUT',    headers: buildHeaders(), body: JSON.stringify(body) })
export const apiDelete = (path)        => request(path, { method: 'DELETE', headers: buildHeaders() })

// ── Auth ─────────────────────────────────────────────────
export const login = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export const register = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
  return data
}

export const logout = async () => {
  await supabase.auth.signOut()
  clearToken()
}

// ── User ─────────────────────────────────────────────────
export const getProfile = () => apiGet('/api/user/profile')
export const updateProfile = (body) => apiPut('/api/user/profile', body)
export const changePassword = (body) => apiPost('/api/user/change-password', body)

// ── Resume ───────────────────────────────────────────────
export const getResumes    = ()          => apiGet('/api/resume/list')
export const createResume  = (body)      => apiPost('/api/resume/create', body)
export const updateResume  = (id, body)  => apiPut(`/api/resume/${id}`, body)
export const deleteResume  = (id)        => apiDelete(`/api/resume/${id}`)

// ── Cover Letter ─────────────────────────────────────────
export const getCoverLetters    = ()     => apiGet('/api/coverletter/list')
export const createCoverLetter  = (body) => apiPost('/api/coverletter/create', body)
export const deleteCoverLetter  = (id)   => apiDelete(`/api/coverletter/${id}`)

// ── AI Endpoints ─────────────────────────────────────────
export const generateResume  = (body) => apiPost('/api/ai/generate-resume', body)
export const generateCover   = (body) => apiPost('/api/ai/generate-cover', body)
export const getATSScore     = (body) => apiPost('/api/ai/ats-score', body)

// ── Profile Picture Upload ───────────────────────────────
export const uploadProfilePicture = async (file) => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    throw new Error('Please login first')
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${session.user.id}-${Date.now()}.${fileExt}`

  const { error } = await supabase.storage
    .from('profile-pictures')
    .upload(fileName, file)

  if (error) throw error

  const { data } = supabase.storage
    .from('profile-pictures')
    .getPublicUrl(fileName)

  return data.publicUrl
}

export const updateProfilePicture = (photoURL) => apiPut('/api/user/profile', { profile_picture_url: photoURL })