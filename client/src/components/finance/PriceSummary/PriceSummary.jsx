import React from 'react'
import { useConfigurator } from '../../../hooks/useConfigurator.js'
import { formatCurrency } from '../../../utils/formatters/currencyFormatter.js'

const PriceSummary = () => {
  const { currentBuild } = useConfigurator()

  if (!currentBuild.pricing) {
    return (
      <div className="card p-6 text-center text-gray-500">
        <div className="text-4xl mb-2">💰</div>
        <p>Select a vehicle to see pricing</p>
      </div>
    )
  }

  const { basePrice, optionsTotal, packagesTotal, colorPrice, totalPrice } = currentBuild.pricing

  // Calculate package savings
  const packageSavings = currentBuild.selectedPackages.reduce((savings, pkg) => {
    const individualValue = pkg.includedOptions?.reduce((total, included) => {
      return total + (included.option?.price || 0) * (included.quantity || 1)
    }, 0) || 0
    return savings + (individualValue - pkg.price)
  }, 0)

  return (
    <div className="card p-6">
      <h3 className="font-semibold text-lg mb-4 flex items-center">
        <span className="text-2xl mr-2">💰</span>
        Price Summary
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Base Vehicle</span>
          <span>{formatCurrency(basePrice)}</span>
        </div>
        
        {colorPrice > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Color: {currentBuild.selectedColor?.name}</span>
            <span>+{formatCurrency(colorPrice)}</span>
          </div>
        )}
        
        {optionsTotal > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Options ({currentBuild.selectedOptions.length})</span>
            <span>+{formatCurrency(optionsTotal)}</span>
          </div>
        )}
        
        {packagesTotal > 0 && (
          <>
            <div className="flex justify-between text-gray-600">
              <span>Packages ({currentBuild.selectedPackages.length})</span>
              <span>+{formatCurrency(packagesTotal)}</span>
            </div>
            {packageSavings > 0 && (
              <div className="flex justify-between text-green-600 text-sm bg-green-50 p-2 rounded">
                <span>Package Savings</span>
                <span>-{formatCurrency(packageSavings)}</span>
              </div>
            )}
          </>
        )}
        
        <hr className="my-3 border-gray-200" />
        
        <div className="flex justify-between text-lg font-bold">
          <span>Total Price</span>
          <span className="text-primary-600">{formatCurrency(totalPrice)}</span>
        </div>
      </div>

      {currentBuild.vehicle && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium mb-2 text-blue-900">Selected Vehicle</h4>
          <div className="flex items-center space-x-3">
            <img
              src={currentBuild.vehicle.images.main}
              alt={currentBuild.vehicle.name}
              className="w-16 h-12 object-cover rounded"
            />
            <div className="flex-1">
              <div className="font-medium text-blue-900">
                {currentBuild.vehicle.manufacturer} {currentBuild.vehicle.model}
              </div>
              <div className="text-sm text-blue-700">
                {currentBuild.selectedColor?.name}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                {currentBuild.selectedOptions.length} options • {currentBuild.selectedPackages.length} packages
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Package Benefits Summary */}
      {currentBuild.selectedPackages.length > 0 && (
        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <h5 className="font-medium text-amber-900 text-sm mb-1">
            🎁 Package Benefits
          </h5>
          <div className="text-xs text-amber-800 space-y-1">
            <div>• {currentBuild.selectedPackages.length} packages selected</div>
            <div>• {packageSavings > 0 ? `Saving ${formatCurrency(packageSavings)}` : 'Best value pricing'}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PriceSummary