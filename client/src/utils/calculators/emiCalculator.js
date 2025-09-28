export const EMIService = {
  calculateEMI(principal, annualInterestRate, tenureMonths) {
    if (principal <= 0 || tenureMonths <= 0) {
      return 0
    }

    const monthlyInterestRate = annualInterestRate / 12 / 100
    
    if (monthlyInterestRate === 0) {
      return principal / tenureMonths
    }

    const emi = principal * 
      monthlyInterestRate * 
      Math.pow(1 + monthlyInterestRate, tenureMonths) / 
      (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1)

    return Math.round(emi * 100) / 100
  },

  calculateTotalPayment(emi, tenureMonths) {
    return emi * tenureMonths
  },

  calculateTotalInterest(totalPayment, principal) {
    return totalPayment - principal
  },

  validateLoanParameters(principal, annualInterestRate, tenureMonths, downPayment = 0) {
    const errors = []

    if (principal <= 0) errors.push('Principal must be greater than 0')
    if (annualInterestRate < 0) errors.push('Interest rate cannot be negative')
    if (tenureMonths < 1) errors.push('Tenure must be at least 1 month')
    if (downPayment < 0) errors.push('Down payment cannot be negative')
    if (downPayment >= principal) errors.push('Down payment must be less than principal')

    return {
      isValid: errors.length === 0,
      errors
    }
  }
}