import BigNumber from 'big.js';

export const formatFioAmount = (amount: number): string => {
  return BigNumber(amount).div(1000000000).toFixed(2);
};
