export class EMIService {
  static calculateEMI(principal, annualInterestRate, tenureMonths) {
    if (principal <= 0 || tenureMonths <= 0) {
      throw new Error('Principal and tenure must be positive values');
    }

    const monthlyInterestRate = annualInterestRate / 12 / 100;
    
    if (monthlyInterestRate === 0) {
      return principal / tenureMonths;
    }

    const emi = principal * 
      monthlyInterestRate * 
      Math.pow(1 + monthlyInterestRate, tenureMonths) / 
      (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);

    return Math.round(emi * 100) / 100; // Round to 2 decimal places
  }

  static calculateTotalPayment(emi, tenureMonths) {
    return emi * tenureMonths;
  }

  static calculateTotalInterest(totalPayment, principal) {
    return totalPayment - principal;
  }

  static getEMISchedule(principal, annualInterestRate, tenureMonths) {
    const monthlyInterestRate = annualInterestRate / 12 / 100;
    const emi = this.calculateEMI(principal, annualInterestRate, tenureMonths);
    let balance = principal;
    const schedule = [];

    for (let month = 1; month <= tenureMonths; month++) {
      const interest = balance * monthlyInterestRate;
      const principalComponent = emi - interest;
      balance -= principalComponent;

      schedule.push({
        month,
        emi: Math.round(emi * 100) / 100,
        principal: Math.round(principalComponent * 100) / 100,
        interest: Math.round(interest * 100) / 100,
        balance: Math.round(Math.max(0, balance) * 100) / 100
      });
    }

    return schedule;
  }

  static validateLoanParameters(principal, annualInterestRate, tenureMonths, downPayment = 0) {
    const errors = [];

    if (principal <= 0) errors.push('Principal must be greater than 0');
    if (annualInterestRate < 0) errors.push('Interest rate cannot be negative');
    if (tenureMonths < 1) errors.push('Tenure must be at least 1 month');
    if (downPayment < 0) errors.push('Down payment cannot be negative');
    if (downPayment >= principal) errors.push('Down payment must be less than principal');

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}