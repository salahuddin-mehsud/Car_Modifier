import React, { useState } from 'react'
import { Calculator, DollarSign, Percent, Calendar } from 'lucide-react'
import { EMIService } from '../../../utils/calculators/emiCalculator.js'
import { formatCurrency } from '../../../utils/formatters/currencyFormatter.js'

const EMICalculator = ({ vehiclePrice, onEMIUpdate }) => {
  const [formData, setFormData] = useState({
    loanAmount: vehiclePrice || 0,
    downPayment: 0,
    interestRate: 5.5,
    tenureMonths: 60
  })

  const [results, setResults] = useState(null)

  const calculateEMI = () => {
    const principal = formData.loanAmount - formData.downPayment
    const validation = EMIService.validateLoanParameters(
      principal,
      formData.interestRate,
      formData.tenureMonths,
      formData.downPayment
    )

    if (!validation.isValid) {
      alert(validation.errors.join(', '))
      return
    }

    const emi = EMIService.calculateEMI(
      principal,
      formData.interestRate,
      formData.tenureMonths
    )
    const totalPayment = EMIService.calculateTotalPayment(emi, formData.tenureMonths)
    const totalInterest = EMIService.calculateTotalInterest(totalPayment, principal)

    const newResults = {
      emi,
      totalPayment,
      totalInterest,
      principal,
      tenureMonths: formData.tenureMonths
    }

    setResults(newResults)
    onEMIUpdate?.(newResults)
  }

  const handleInputChange = (field, value) => {
    const newFormData = {
      ...formData,
      [field]: parseFloat(value) || 0
    }
    
    // Ensure downPayment doesn't exceed loan amount
    if (field === 'downPayment' && value > formData.loanAmount) {
      newFormData.downPayment = formData.loanAmount
    }
    
    setFormData(newFormData)
  }

  React.useEffect(() => {
    if (vehiclePrice && vehiclePrice !== formData.loanAmount) {
      setFormData(prev => ({
        ...prev,
        loanAmount: vehiclePrice
      }))
    }
  }, [vehiclePrice])

  React.useEffect(() => {
    calculateEMI()
  }, [formData])

  return (
    <div className="card p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Calculator className="h-5 w-5 text-primary-600" />
        <h3 className="font-semibold text-lg">EMI Calculator</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="h-4 w-4 inline mr-1" />
            Loan Amount
          </label>
          <input
            type="number"
            value={formData.loanAmount}
            onChange={(e) => handleInputChange('loanAmount', e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="h-4 w-4 inline mr-1" />
            Down Payment
          </label>
          <input
            type="number"
            value={formData.downPayment}
            onChange={(e) => handleInputChange('downPayment', e.target.value)}
            className="input"
            max={formData.loanAmount}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Percent className="h-4 w-4 inline mr-1" />
            Interest Rate (% per year)
          </label>
          <input
            type="number"
            step="0.1"
            value={formData.interestRate}
            onChange={(e) => handleInputChange('interestRate', e.target.value)}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="h-4 w-4 inline mr-1" />
            Loan Term (months)
          </label>
          <select
            value={formData.tenureMonths}
            onChange={(e) => handleInputChange('tenureMonths', e.target.value)}
            className="input"
          >
            <option value="12">12 months (1 year)</option>
            <option value="24">24 months (2 years)</option>
            <option value="36">36 months (3 years)</option>
            <option value="48">48 months (4 years)</option>
            <option value="60">60 months (5 years)</option>
            <option value="72">72 months (6 years)</option>
            <option value="84">84 months (7 years)</option>
          </select>
        </div>
      </div>

      {results && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold mb-3">Calculation Results</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Monthly EMI</div>
              <div className="text-xl font-bold text-primary-600">
                {formatCurrency(results.emi)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Interest</div>
              <div className="text-lg font-semibold text-red-600">
                {formatCurrency(results.totalInterest)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Payment</div>
              <div className="text-lg font-semibold">
                {formatCurrency(results.totalPayment)}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Loan Amount</div>
              <div className="text-lg font-semibold">
                {formatCurrency(results.principal)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EMICalculator