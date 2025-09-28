import React from 'react'
import { Check } from 'lucide-react'
import { useConfigurator } from '../../../hooks/useConfigurator.js'
import { formatCurrency } from '../../../utils/formatters/currencyFormatter.js'

const ColorPicker = () => {
  const { currentBuild, selectColor } = useConfigurator()

  if (!currentBuild.vehicle) {
    return (
      <div className="text-center py-8 text-gray-500">
        Please select a vehicle first
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Select Exterior Color</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentBuild.vehicle.availableColors.map((color) => (
          <div
            key={color.name}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              currentBuild.selectedColor?.name === color.name
                ? 'border-primary-500 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => selectColor(color)}
          >
            <div
              className="w-full h-20 rounded-md mb-3"
              style={{ backgroundColor: color.code }}
            />
            <div className="flex justify-between items-center">
              <span className="font-medium text-sm">{color.name}</span>
              {color.price > 0 && (
                <span className="text-sm text-gray-600">
                  +{formatCurrency(color.price)}
                </span>
              )}
            </div>
            {currentBuild.selectedColor?.name === color.name && (
              <div className="flex justify-center mt-2">
                <Check className="h-4 w-4 text-primary-500" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ColorPicker