import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

export const login = async (email: string, password: string) => {
  const response = await axiosInstance.post('/auth/login', { email, password })
  localStorage.setItem('token', response.data.accessToken)
  return response.data
}

export const logout = () => {
  localStorage.removeItem('token')
}

export const register = async (username: string, email: string, password: string) => {
  const response = await axiosInstance.post('/auth/register', { username, email, password })
  return response.data
}

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const response = await axiosInstance.post('/auth/change-password', { currentPassword, newPassword })
  return response.data
}

export const getAllPersonas = async () => {
  const response = await axiosInstance.get('/personas')
  return response.data
}

export const getPersonaById = async (id: string) => {
  const response = await axiosInstance.get(`/personas/${id}`)
  return response.data
}

export const chatWithPersona = async (personaId: string, message: string) => {
  const response = await axiosInstance.post('/chat', { personaId, message })
  return response.data
}

export const getChatHistory = async (personaId: string) => {
  const response = await axiosInstance.get(`/chat/history/${personaId}`)
  return response.data
}

export const getUserProfile = async (token: string) => {
  const response = await axiosInstance.get('/auth/profile', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}

export default axiosInstance