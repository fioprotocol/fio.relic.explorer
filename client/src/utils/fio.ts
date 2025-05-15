import BigNumber from 'big.js';

import { FIO_PREFIX, FIO_SUF_UNITS } from '@shared/constants/fio';
import { AMERICA_NEW_YORK_TIMEZONE } from '@shared/constants/timezone';

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

export const getNextGovernanceDate = ({
  returnLastVoteDate,
  returnDefaultFormat,
}: {
  returnLastVoteDate?: boolean;
  returnDefaultFormat?: boolean;
} = {}): string => {
  const createDates = (year: number): Date[] => [
    new Date(Date.UTC(year, 3, 15, 19)), // April 15th 2PM (UTC-5)
    new Date(Date.UTC(year, 7, 16, 19)), // August 16th 2PM (UTC-5)
    new Date(Date.UTC(year, 11, 15, 19)), // December 15th 2PM (UTC-5)
  ];

  const now = new Date();
  const dates = createDates(now.getUTCFullYear());

  let voteDate;
  if (returnLastVoteDate) {
    // Find the last past date
    const pastDates = dates.filter(date => date < now);
    voteDate =
      pastDates.length > 0
        ? pastDates[pastDates.length - 1]
        : createDates(now.getUTCFullYear() - 1)[2]; // Last date of previous year
  } else {
    // Find next future date or first date of next year
    voteDate =
      dates.find(date => date > now) ||
      new Date(dates[0].setFullYear(dates[0].getFullYear() + 1));
  }

  if (returnDefaultFormat)
    return voteDate.toLocaleString('en-US', {
      timeZone: AMERICA_NEW_YORK_TIMEZONE,
    });

  const month = voteDate.toLocaleString('en-US', {
    month: 'long',
    timeZone: AMERICA_NEW_YORK_TIMEZONE,
  });
  const day = voteDate.toLocaleString('en-US', {
    day: 'numeric',
    timeZone: AMERICA_NEW_YORK_TIMEZONE,
  });
  const time = voteDate.toLocaleString('en-US', {
    hour: 'numeric',
    hour12: true,
    timeZone: AMERICA_NEW_YORK_TIMEZONE,
  });
  const year = voteDate.toLocaleString('en-US', {
    year: 'numeric',
    timeZone: AMERICA_NEW_YORK_TIMEZONE,
  });

  return `${month} ${day}th ${time} (UTC-5), ${year}`;
};
