import React from 'react'
import { Check, Zap, Star, Shield, Palette } from 'lucide-react'
import { useConfigurator } from '../../../hooks/useConfigurator.js'
import { formatCurrency } from '../../../utils/formatters/currencyFormatter.js'

const PackageSelector = () => {
  const { packages, currentBuild, togglePackage } = useConfigurator()

  const getPackageIcon = (type) => {
    switch (type) {
      case 'performance':
        return <Zap className="h-5 w-5" />
      case 'luxury':
        return <Star className="h-5 w-5" />
      case 'safety':
        return <Shield className="h-5 w-5" />
      case 'appearance':
        return <Palette className="h-5 w-5" />
      default:
        return <Star className="h-5 w-5" />
    }
  }

  const isPackageSelected = (pkg) => {
    return currentBuild.selectedPackages.some(p => p._id === pkg._id)
  }

  if (!currentBuild.vehicle) {
    return (
      <div className="text-center py-8 text-gray-500">
        Please select a vehicle first
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Available Packages</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {packages.map((pkg) => {
          const isSelected = isPackageSelected(pkg)
          const finalPrice = pkg.price * (1 - (pkg.discount || 0) / 100)
          
          return (
            <div
              key={pkg._id}
              className={`card p-6 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'ring-2 ring-primary-500 border-primary-500'
                  : 'hover:shadow-md'
              }`}
              onClick={() => togglePackage(pkg)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                    {getPackageIcon(pkg.type)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{pkg.name}</h4>
                    <span className="text-sm text-gray-600 capitalize">
                      {pkg.type} Package
                    </span>
                  </div>
                </div>
                
                {isSelected && (
                  <Check className="h-5 w-5 text-primary-500 flex-shrink-0" />
                )}
              </div>

              <p className="text-gray-600 mb-4">{pkg.description}</p>

              <div className="mb-4">
                <h5 className="font-medium mb-2">Includes:</h5>
                <ul className="space-y-1">
                  {pkg.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-600">
                      <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                  {pkg.features.length > 3 && (
                    <li className="text-sm text-gray-500">
                      +{pkg.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </div>

              <div className="flex justify-between items-center">
                <div>
                  {pkg.discount > 0 && (
                    <span className="text-sm text-gray-500 line-through mr-2">
                      {formatCurrency(pkg.price)}
                    </span>
                  )}
                  <span className="text-lg font-bold text-primary-600">
                    {formatCurrency(finalPrice)}
                  </span>
                </div>
                {pkg.discount > 0 && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                    Save {pkg.discount}%
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PackageSelector