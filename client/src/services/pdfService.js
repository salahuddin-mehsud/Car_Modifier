import api from './api.js'

export const pdfService = {
  async generateBuildReport(buildId) {
    const response = await api.get(`/pdf/build-report/${buildId}`, {
      responseType: 'blob'
    })
    return URL.createObjectURL(response.data)
  },

  async generateOrderInvoice(orderId) {
    const response = await api.get(`/pdf/order-invoice/${orderId}`, {
      responseType: 'blob'
    })
    return URL.createObjectURL(response.data)
  }
}