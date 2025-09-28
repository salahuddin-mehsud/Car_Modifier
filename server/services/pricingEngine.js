export class PricingEngine {
  static calculateBuildPrice(vehicle, selectedOptions, selectedPackages, selectedColor) {
    let totalPrice = vehicle.basePrice;

    // Add color price
    if (selectedColor && selectedColor.price) {
      totalPrice += selectedColor.price;
    }

    // Add options prices
    if (selectedOptions && selectedOptions.length > 0) {
      selectedOptions.forEach(option => {
        totalPrice += option.price * (option.quantity || 1);
      });
    }

    // Add packages prices (apply package discount)
    if (selectedPackages && selectedPackages.length > 0) {
      selectedPackages.forEach(pkg => {
        const packagePrice = pkg.price * (1 - (pkg.discount || 0) / 100);
        totalPrice += packagePrice;
      });
    }

    return {
      basePrice: vehicle.basePrice,
      optionsTotal: selectedOptions?.reduce((sum, opt) => sum + (opt.price * (opt.quantity || 1)), 0) || 0,
      packagesTotal: selectedPackages?.reduce((sum, pkg) => sum + (pkg.price * (1 - (pkg.discount || 0) / 100)), 0) || 0,
      colorPrice: selectedColor?.price || 0,
      totalPrice: Math.max(0, totalPrice) // Ensure non-negative
    };
  }

  static calculateTax(totalPrice, taxRate = 0.08) {
    return totalPrice * taxRate;
  }

  static calculateShipping(zipCode, vehicleType) {
    // Simplified shipping calculation
    const baseShipping = 1500;
    let multiplier = 1;
    
    if (vehicleType === 'suv' || vehicleType === 'truck') multiplier = 1.2;
    if (vehicleType === 'sports') multiplier = 1.5;
    
    return baseShipping * multiplier;
  }

  static applyDiscount(totalPrice, discountCode) {
    // Simplified discount logic
    const discounts = {
      'WELCOME10': 0.1,
      'FIRSTORDER': 0.15,
      'LOYALTY20': 0.2
    };

    const discountRate = discounts[discountCode] || 0;
    return totalPrice * discountRate;
  }
}