import api from './api.js'

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    return response.data.data
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data.data
  },

  async getProfile() {
    const response = await api.get('/auth/profile')
    return response.data.data
  },

  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData)
    return response.data.data
  },

  async changePassword(passwordData) {
    const response = await api.put('/auth/change-password', passwordData)
    return response.data
  }
}