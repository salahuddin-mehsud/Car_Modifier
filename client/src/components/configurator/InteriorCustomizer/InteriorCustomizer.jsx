import React from 'react'
import { Check } from 'lucide-react'
import { useConfigurator } from '../../../hooks/useConfigurator.js'
import { formatCurrency } from '../../../utils/formatters/currencyFormatter.js'

const InteriorCustomizer = () => {
  const { options, currentBuild, toggleOption } = useConfigurator()

  const interiorOptions = options.filter(opt => 
    opt.category === 'interior'
  )

  if (!currentBuild.vehicle) {
    return (
      <div className="text-center py-8 text-gray-500">
        Please select a vehicle first
      </div>
    )
  }

  const isOptionSelected = (option) => {
    return currentBuild.selectedOptions.some(opt => opt._id === option._id)
  }

  const optionsBySubcategory = interiorOptions.reduce((acc, option) => {
    if (!acc[option.subcategory]) {
      acc[option.subcategory] = []
    }
    acc[option.subcategory].push(option)
    return acc
  }, {})

  return (
    <div className="space-y-8">
      <h3 className="font-semibold text-lg">Interior Customization</h3>
      
      {Object.entries(optionsBySubcategory).map(([subcategory, options]) => (
        <div key={subcategory} className="card p-6">
          <h4 className="font-semibold text-lg mb-4 capitalize">
            {subcategory.replace('-', ' ')}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option) => {
              const isSelected = isOptionSelected(option)
              
              return (
                <div
                  key={option._id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleOption(option)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-medium">{option.name}</h5>
                      <p className="text-sm text-gray-600 mt-1">
                        {option.description}
                      </p>
                    </div>
                    {isSelected && (
                      <Check className="h-5 w-5 text-primary-500 flex-shrink-0" />
                    )}
                  </div>
                  
                  {option.price > 0 && (
                    <div className="mt-3 text-right">
                      <span className="font-bold text-primary-600">
                        +{formatCurrency(option.price)}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default InteriorCustomizer