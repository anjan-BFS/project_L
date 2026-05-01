const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'
const STORAGE_KEY = 'careerCraftToken'

const getToken = () => localStorage.getItem(STORAGE_KEY)
export const saveToken = (token) => localStorage.setItem(STORAGE_KEY, token)
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

export const apiGet = async (path) => {
  return request(path, {
    method: 'GET',
    headers: buildHeaders(),
  })
}

export const apiPost = async (path, body) => {
  return request(path, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify(body),
  })
}

export const login = async ({ email, password }) => {
  return apiPost('/api/auth/login', { email, password })
}

export const register = async ({ name, email, password }) => {
  return apiPost('/api/auth/register', { email, password, name })
}

export const getProfile = async () => {
  return apiGet('/api/user/profile')
}

export const getResumes = async () => {
  return apiGet('/api/resume/list')
}

export const getCoverLetters = async () => {
  return apiGet('/api/coverletter/list')
}
