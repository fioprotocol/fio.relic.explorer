import BigNumber from 'big.js';

import { FIO_PREFIX, FIO_SUF_UNITS } from '@shared/constants/fio';

export const formatFioAmount = (amount: number | string | BigNumber): string => {
  let value;

  try {
    value = new BigNumber(amount);
  } catch {
    return '';
  }

  return `${value.div(FIO_SUF_UNITS).toFixed(2)} ${FIO_PREFIX}`;
};
