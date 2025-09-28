import React from 'react'
import { Check, Eye } from 'lucide-react'
import { useConfigurator } from '../../../hooks/useConfigurator.js'
import Loader from '../../common/Loader/Loader.jsx'
import { formatCurrency } from '../../../utils/formatters/currencyFormatter.js'

const VehicleSelector = () => {
  const { vehicles, loading, currentBuild, selectVehicle } = useConfigurator()

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" />
      </div>
    )
  }

  // Group vehicles by manufacturer for better organization
  const vehiclesByManufacturer = vehicles.reduce((acc, vehicle) => {
    if (!acc[vehicle.manufacturer]) {
      acc[vehicle.manufacturer] = []
    }
    acc[vehicle.manufacturer].push(vehicle)
    return acc
  }, {})

  return (
    <div className="space-y-8">
      {Object.entries(vehiclesByManufacturer).map(([manufacturer, manufacturerVehicles]) => (
        <div key={manufacturer} className="card p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">
            {manufacturer} Models
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {manufacturerVehicles.map((vehicle) => (
              <div
                key={vehicle._id}
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  currentBuild.vehicle?._id === vehicle._id
                    ? 'border-primary-500 shadow-2xl bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }`}
                onClick={() => selectVehicle(vehicle)}
              >
                {/* Model Preview */}
                <div className="relative mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg h-48 flex items-center justify-center">
                  {vehicle.modelPath ? (
                    <div className="text-center">
                      <div className="text-6xl mb-2">🚗</div>
                      <div className="flex items-center justify-center text-sm text-gray-600">
                        <Eye className="h-3 w-3 mr-1" />
                        3D Model Ready
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400">
                      <div className="text-4xl mb-2">📷</div>
                      <p className="text-sm">Image Preview</p>
                    </div>
                  )}
                  
                  {currentBuild.vehicle?._id === vehicle._id && (
                    <div className="absolute top-2 right-2 bg-primary-500 text-white p-2 rounded-full shadow-lg">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
                
                {/* Vehicle Info */}
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-gray-900">
                    {vehicle.model}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {vehicle.description}
                  </p>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-2xl font-bold text-primary-600">
                      {formatCurrency(vehicle.basePrice)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      vehicle.inventory.inStock 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {vehicle.inventory.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Quick Specs */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 pt-2 border-t">
                    <div>🏎️ {vehicle.specifications.horsepower} HP</div>
                    <div>⚡ {vehicle.specifications.acceleration}s 0-60</div>
                    <div>🛣️ {vehicle.specifications.topSpeed} mph</div>
                    <div>💺 {vehicle.specifications.seating} seats</div>
                  </div>

                  {/* Available Colors Preview */}
                  <div className="flex space-x-1 pt-2">
                    {vehicle.availableColors.slice(0, 4).map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.code }}
                        title={color.name}
                      />
                    ))}
                    {vehicle.availableColors.length > 4 && (
                      <div className="text-xs text-gray-400">
                        +{vehicle.availableColors.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default VehicleSelector