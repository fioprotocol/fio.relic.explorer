import BigNumber from 'big.js';

import { FIO_PREFIX, FIO_SUF_UNITS } from '@shared/constants/fio';

export const formatFioAmount = ({
  amount,
  hasFullAmount = false,
}: {
  amount: number | string | BigNumber;
  hasFullAmount?: boolean;
  currency?: string;
}): string => {
  let value;

  try {
    value = new BigNumber(amount);
  } catch {
    return '';
  }

  if (hasFullAmount) {
    return `${value.div(FIO_SUF_UNITS).toNumber().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 20 })} ${FIO_PREFIX}`;
  }

  return `${value.div(FIO_SUF_UNITS).toNumber().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${FIO_PREFIX}`;
};
