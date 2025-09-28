import api from './api.js'

export const orderService = {
  async createOrder(orderData) {
    const response = await api.post('/orders', orderData)
    return response.data.data
  },

  async getUserOrders(params = {}) {
    const response = await api.get('/orders', { params })
    return response.data.data
  },

  async getOrderById(id) {
    const response = await api.get(`/orders/${id}`)
    return response.data.data
  },

  async updateOrderStatus(id, status) {
    const response = await api.put(`/orders/${id}/status`, { status })
    return response.data.data
  },

  async cancelOrder(id) {
    const response = await api.put(`/orders/${id}/cancel`)
    return response.data.data
  }
}