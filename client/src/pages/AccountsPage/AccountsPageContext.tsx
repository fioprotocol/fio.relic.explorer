import { useState } from 'react';
import { DataItem } from 'src/components/common/DataTile';
import { useGetData } from 'src/hooks/useGetData';
import {
  useCursorPaginationData,
  UseCursorPaginationReturn,
} from 'src/hooks/useCursorPaginationData';
import { getAccountStats, AccountStatsResponse } from 'src/services/fio-protocol';
import { getAccounts } from 'src/services/accounts';
import { formatTokenValue } from 'src/utils/general';
import { Account, AccountSortOption } from '@shared/types/accounts';
import { ACCOUNT_SORT_OPTIONS } from '@shared/constants/accounts';

type UseAccountsPageType = {
  stats: DataItem[];
  statsLoading: boolean;
  accounts: Account[];
  totalAccounts: number;
  sort: AccountSortOption;
  setSort: (option: AccountSortOption) => void;
} & Omit<UseCursorPaginationReturn<Account>, 'data' | 'otherData'>;

export const useAccountsPageContext = (): UseAccountsPageType => {
  const [sort, setSort] = useState<AccountSortOption>(ACCOUNT_SORT_OPTIONS.ACCOUNT_ID);

  const { response, loading: statsLoading } = useGetData<AccountStatsResponse>({
    action: getAccountStats,
  });

  const {
    data: accounts,
    otherData,
    ...cursorPaginationProps
  } = useCursorPaginationData<Account, { total: number }>({
    action: getAccounts,
    params: { sort, include_total: true },
    dataKey: 'data',
  });

  const stats: DataItem[] = [
    {
      title: 'Max Token Supply',
      value: '1,000,000,000 FIO',
    },
    {
      title: 'Current Token Supply',
      value: `${formatTokenValue(response?.currentTokenSupply)} FIO`,
    },
    {
      title: 'Circulating Token Supply',
      value: `${formatTokenValue(response?.tokenCirculatingSupply)} FIO`,
    },
    {
      title: 'FIO Price',
      value: `${formatTokenValue(response?.roe)} USD`,
    },
    {
      title: 'Staked FIO',
      value: `${formatTokenValue(response?.stakedFio)} FIO`,
    },
    {
      title: 'Locked Supply',
      value: `${formatTokenValue(response?.lockedTokens)} FIO`,
    },
  ];

  return {
    stats,
    statsLoading,
    accounts: accounts || [],
    totalAccounts: otherData?.total || 0,
    sort,
    setSort,
    ...cursorPaginationProps,
  };
};
