export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const convertCurrency = (amount, fromCurrency, toCurrency, rates) => {
  if (!rates[fromCurrency] || !rates[toCurrency]) {
    throw new Error('Currency rates not available');
  }
  
  const amountInUSD = amount / rates[fromCurrency];
  return amountInUSD * rates[toCurrency];
};