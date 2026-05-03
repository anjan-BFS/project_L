const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
const STORAGE_KEY = 'careerCraftToken'

export const getToken   = () => localStorage.getItem(STORAGE_KEY)
export const saveToken  = (token) => localStorage.setItem(STORAGE_KEY, token)
export const clearToken = () => localStorage.removeItem(STORAGE_KEY)

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

// ── Generic Methods ──────────────────────────────────────
export const apiGet    = (path)        => request(path, { method: 'GET',    headers: buildHeaders() })
export const apiPost   = (path, body)  => request(path, { method: 'POST',   headers: buildHeaders(), body: JSON.stringify(body) })
export const apiPut    = (path, body)  => request(path, { method: 'PUT',    headers: buildHeaders(), body: JSON.stringify(body) })
export const apiDelete = (path)        => request(path, { method: 'DELETE', headers: buildHeaders() })

// ── Auth ─────────────────────────────────────────────────
export const login    = ({ email, password })       => apiPost('/api/auth/login',    { email, password })
export const register = ({ name, email, password }) => apiPost('/api/auth/register', { name, email, password })

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