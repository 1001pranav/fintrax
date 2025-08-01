export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
    
};

export const formatPercentage = (value: number): string => {
  return `${Math.abs(value).toFixed(1)}%`;
};
