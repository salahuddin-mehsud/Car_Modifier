import React from 'react'
import { Check, Info, Zap, Star, Shield, Palette, Settings } from 'lucide-react'
import { useConfigurator } from '../../../hooks/useConfigurator.js'
import { formatCurrency } from '../../../utils/formatters/currencyFormatter.js'

const PackageSelector = () => {
  const { packages, currentBuild, togglePackage } = useConfigurator()

  const getPackageIcon = (type) => {
    const iconProps = { className: "h-5 w-5" }
    
    switch (type) {
      case 'performance':
        return <Zap {...iconProps} />
      case 'luxury':
        return <Star {...iconProps} />
      case 'safety':
        return <Shield {...iconProps} />
      case 'technology':
        return <Settings {...iconProps} />
      case 'appearance':
        return <Palette {...iconProps} />
      case 'premium':
        return <Star {...iconProps} />
      default:
        return <Settings {...iconProps} />
    }
  }

  const getPackageColor = (type) => {
    switch (type) {
      case 'performance':
        return 'bg-red-100 text-red-600'
      case 'luxury':
        return 'bg-amber-100 text-amber-600'
      case 'safety':
        return 'bg-blue-100 text-blue-600'
      case 'technology':
        return 'bg-purple-100 text-purple-600'
      case 'appearance':
        return 'bg-green-100 text-green-600'
      case 'premium':
        return 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const isPackageSelected = (pkg) => {
    return currentBuild.selectedPackages.some(p => p._id === pkg._id)
  }

  const calculateSavings = (pkg) => {
    if (!pkg.discount || pkg.discount === 0) return 0
    
    // Calculate total value of individual options
    const individualOptionsTotal = pkg.includedOptions?.reduce((total, included) => {
      const option = included.option
      return total + (option?.price || 0) * (included.quantity || 1)
    }, 0) || 0
    
    return individualOptionsTotal - pkg.price
  }

  if (!currentBuild.vehicle) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold mb-2">Select a Vehicle First</h3>
        <p className="text-gray-600">Choose a vehicle to see available packages</p>
      </div>
    )
  }

  // Filter packages that are compatible with the selected vehicle
  const compatiblePackages = packages.filter(pkg => 
    !pkg.compatibleVehicles || 
    pkg.compatibleVehicles.length === 0 ||
    pkg.compatibleVehicles.some(vehicle => vehicle._id === currentBuild.vehicle._id)
  )

  if (compatiblePackages.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold mb-2">No Packages Available</h3>
        <p className="text-gray-600">No compatible packages found for the selected vehicle</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-3">Available Packages</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose from our curated packages to enhance your vehicle. Each package includes 
          carefully selected options at a discounted price compared to purchasing individually.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {compatiblePackages.map((pkg) => {
          const isSelected = isPackageSelected(pkg)
          const finalPrice = pkg.price * (1 - (pkg.discount || 0) / 100)
          const savings = calculateSavings(pkg)
          
          return (
            <div
              key={pkg._id}
              className={`card p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                isSelected
                  ? 'ring-4 ring-primary-500 border-primary-500 shadow-xl'
                  : 'hover:shadow-lg border-gray-200'
              }`}
              onClick={() => togglePackage(pkg)}
            >
              {/* Package Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-full ${getPackageColor(pkg.type)}`}>
                    {getPackageIcon(pkg.type)}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl">{pkg.name}</h3>
                    <span className="text-sm text-gray-600 capitalize">
                      {pkg.type.replace('_', ' ')} Package
                    </span>
                  </div>
                </div>
                
                {/* Selection Indicator */}
                <div className={`p-2 rounded-full border-2 ${
                  isSelected 
                    ? 'bg-primary-500 border-primary-500 text-white' 
                    : 'bg-white border-gray-300 text-transparent'
                }`}>
                  <Check className="h-4 w-4" />
                </div>
              </div>

              {/* Package Description */}
              <p className="text-gray-700 mb-4 leading-relaxed">{pkg.description}</p>

              {/* Features List */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Info className="h-4 w-4 mr-2 text-primary-600" />
                  Included Features
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {pkg.features?.slice(0, 5).map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <Check className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                  {pkg.features && pkg.features.length > 5 && (
                    <div className="text-xs text-gray-500 mt-1">
                      + {pkg.features.length - 5} more features
                    </div>
                  )}
                </div>
              </div>

              {/* Included Options Summary */}
              {pkg.includedOptions && pkg.includedOptions.length > 0 && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">
                    Includes {pkg.includedOptions.length} premium options
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {pkg.includedOptions.slice(0, 3).map((included, index) => (
                      <span key={index} className="px-2 py-1 bg-white text-xs rounded border">
                        {included.option?.name}
                      </span>
                    ))}
                    {pkg.includedOptions.length > 3 && (
                      <span className="px-2 py-1 bg-white text-xs rounded border">
                        +{pkg.includedOptions.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Pricing Section */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-baseline space-x-2">
                  {pkg.discount > 0 && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatCurrency(pkg.price)}
                    </span>
                  )}
                  <span className="text-2xl font-bold text-primary-600">
                    {formatCurrency(finalPrice)}
                  </span>
                </div>

                <div className="text-right">
                  {pkg.discount > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                        Save {pkg.discount}%
                      </span>
                      {savings > 0 && (
                        <span className="text-xs text-green-600">
                          Save {formatCurrency(savings)}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="text-xs text-gray-500 mt-1">
                    vs. {formatCurrency(pkg.price)} individually
                  </div>
                </div>
              </div>

              {/* Compatibility Badge */}
              <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                <span>✅ Compatible with your {currentBuild.vehicle.manufacturer}</span>
                {isSelected && (
                  <span className="text-primary-600 font-medium">Selected</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Package Selection Summary */}
      {currentBuild.selectedPackages.length > 0 && (
        <div className="mt-8 card p-6 bg-primary-50 border-primary-200">
          <h3 className="font-semibold text-primary-900 mb-3 flex items-center">
            <Check className="h-5 w-5 mr-2" />
            Selected Packages ({currentBuild.selectedPackages.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentBuild.selectedPackages.map((pkg) => (
              <div key={pkg._id} className="bg-white p-3 rounded-lg border border-primary-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">{pkg.name}</span>
                  <span className="text-primary-600 font-bold text-sm">
                    {formatCurrency(pkg.price * (1 - (pkg.discount || 0) / 100))}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    togglePackage(pkg)
                  }}
                  className="text-red-600 hover:text-red-700 text-xs mt-1"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="text-center text-sm text-gray-500 mt-8">
        <p>💡 <strong>Tip:</strong> Packages offer better value than selecting options individually.</p>
        <p>You can mix and match multiple packages to create your perfect configuration.</p>
      </div>
    </div>
  )
}

export default PackageSelector