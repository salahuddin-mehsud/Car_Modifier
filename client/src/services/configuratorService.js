import api from './api.js'

export const configuratorService = {
  async calculatePrice(configuration) {
    const response = await api.post('/configurator/calculate-price', configuration)
    return response.data.data
  },

  async calculateEMI(emiData) {
    const response = await api.post('/configurator/calculate-emi', emiData)
    return response.data.data
  },

  async saveBuild(buildData) {
    const response = await api.post('/configurator/builds', buildData)
    return response.data.data
  },

  async getUserBuilds() {
    const response = await api.get('/configurator/builds')
    return response.data.data
  },

  async getBuildById(id) {
    const response = await api.get(`/configurator/builds/${id}`)
    return response.data.data
  },

  async updateBuild(id, buildData) {
    const response = await api.put(`/configurator/builds/${id}`, buildData)
    return response.data.data
  },

  async deleteBuild(id) {
    const response = await api.delete(`/configurator/builds/${id}`)
    return response.data
  }
}