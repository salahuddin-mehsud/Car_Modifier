import React from 'react'
import { Check } from 'lucide-react'
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <div
          key={vehicle._id}
          className={`card p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
            currentBuild.vehicle?._id === vehicle._id
              ? 'ring-2 ring-primary-500'
              : ''
          }`}
          onClick={() => selectVehicle(vehicle)}
        >
          <div className="relative">
            <img
              src={vehicle.images.main}
              alt={vehicle.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            {currentBuild.vehicle?._id === vehicle._id && (
              <div className="absolute top-2 right-2 bg-primary-500 text-white p-1 rounded-full">
                <Check className="h-4 w-4" />
              </div>
            )}
          </div>
          
          <h3 className="font-semibold text-lg mb-2">
            {vehicle.manufacturer} {vehicle.model}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {vehicle.description}
          </p>
          
          <div className="flex justify-between items-center">
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

          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div>🏎️ {vehicle.specifications.horsepower} HP</div>
            <div>⚡ {vehicle.specifications.acceleration}s 0-60</div>
            <div>🛣️ {vehicle.specifications.topSpeed} mph</div>
            <div>💺 {vehicle.specifications.seating} seats</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default VehicleSelector