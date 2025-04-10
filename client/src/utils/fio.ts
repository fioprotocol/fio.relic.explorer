import BigNumber from 'big.js';

import { FIO_PREFIX, FIO_SUF_UNITS } from '@shared/constants/fio';

export const formatFioAmount = (amount: number | string | BigNumber): string => {
  if (!amount) return '';

  return `${new BigNumber(amount).div(FIO_SUF_UNITS).toFixed(2)} ${FIO_PREFIX}`;
};
