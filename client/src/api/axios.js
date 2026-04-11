import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(config => {
  const stored = JSON.parse(localStorage.getItem('taxbee_user') || 'null')
  const token = stored?.token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('taxbee_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
