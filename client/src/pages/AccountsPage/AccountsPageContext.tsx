import { useState } from 'react';
import { DataItem } from 'src/components/common/DataTile';
import { useGetData } from 'src/hooks/useGetData';
import { usePaginationData, UsePaginationDefaultProps } from 'src/hooks/usePaginationData';
import { getAccountStats, AccountStatsResponse } from 'src/services/fio-protocol';
import { getAccounts } from 'src/services/accounts';
import { formatTokenValue } from 'src/utils/general';
import { Account, AccountSortOption } from '@shared/types/accounts';
import { ACCOUNT_SORT_OPTIONS } from '@shared/constants/accounts';

type UseAccountsPageType = {
  loading: boolean;
  stats: DataItem[];
  statsLoading: boolean;
  accounts: Account[];
  accountsLoading: boolean;
  totalAccounts: number;
  sort: AccountSortOption;
  setSort: (option: AccountSortOption) => void;
  paginationProps: UsePaginationDefaultProps;
};

export const useAccountsPageContext = (): UseAccountsPageType => {
  const [sort, setSort] = useState<AccountSortOption>(ACCOUNT_SORT_OPTIONS.ACCOUNT_ID);

  const { response, loading: statsLoading } = useGetData<AccountStatsResponse>({
    action: getAccountStats,
  });

  const {
    data: accounts,
    loading: accountsLoading,
    total,
    ...paginationProps
  } = usePaginationData<Account>({
    action: getAccounts,
    params: {
      sort,
    },
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
    loading: accountsLoading,
    stats,
    statsLoading,
    accounts: accounts || [],
    accountsLoading,
    totalAccounts: total || 0,
    sort,
    setSort,
    paginationProps,
  };
};
