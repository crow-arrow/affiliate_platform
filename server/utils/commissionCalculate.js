// utils/commissionUtils.js
export const getCommission = (level, totalPrice) => {
  const commissionRates = {
    BRONZE: 0.07, // 7%
    SILVER: 0.1, // 10%
    GOLD: 0.12, // 12%
  };

  if (!commissionRates[level]) {
    throw new Error(`Unknown level: ${level}`);
  }

  return parseFloat((totalPrice * commissionRates[level]).toFixed(2));
};
