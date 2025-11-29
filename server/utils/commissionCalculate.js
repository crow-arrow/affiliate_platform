// utils/commissionUtils.js
export const getCommission = (level, totalPrice) => {
  const commissionRates = {
    Bronze: 0.07, // 7%
    Silver: 0.1, // 10%
    Gold: 0.12, // 12%
  };

  if (!commissionRates[level]) {
    throw new Error(`Unknown level: ${level}`);
  }

  return parseFloat((totalPrice * commissionRates[level]).toFixed(2));
};
