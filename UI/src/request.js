import axios from 'axios'

const service = axios.create({
  baseURL: '', // use relative path so dev server proxy can forward to backend
  timeout: 10000
})

service.interceptors.request.use(
  config => {
    // Add auth token to request headers if available
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

service.interceptors.response.use(
  response => {
    // If response data has success flag, return as-is
    // Otherwise return the full response for legacy handling
    return response.data || response
  },
  error => {
    // Handle common HTTP errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default service

