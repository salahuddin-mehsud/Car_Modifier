import api from './api.js'
import { VEHICLE_MODEL_MAPPING, VEHICLE_MODELS } from '../utils/constants/vehicleModels.js'

export const vehicleService = {
  async getVehicles(params = {}) {
    const response = await api.get('/vehicles', { params })
    
    // Transform vehicles to include model paths
    const vehicles = response.data.data.map(vehicle => ({
      ...vehicle,
      modelPath: this.getModelPathForVehicle(vehicle)
    }))
    
    return vehicles
  },

  async getVehicleById(id) {
    const response = await api.get(`/vehicles/${id}`)
    const vehicle = response.data.data
    
    // Add model path
    return {
      ...vehicle,
      modelPath: this.getModelPathForVehicle(vehicle)
    }
  },

  getModelPathForVehicle(vehicle) {
    const modelKey = VEHICLE_MODEL_MAPPING[vehicle.name] || 
                    VEHICLE_MODEL_MAPPING[vehicle.model] || 
                    'car1'
    
    return VEHICLE_MODELS[modelKey]?.modelPath || '/models/car1.glb'
  },

  async getOptions(params = {}) {
    const response = await api.get('/vehicles/options', { params })
    return response.data.data
  },

  async getPackages(params = {}) {
    const response = await api.get('/vehicles/packages', { params })
    return response.data.data
  }
}