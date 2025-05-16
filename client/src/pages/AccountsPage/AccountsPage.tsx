import { FC, useMemo } from 'react';
import { Link } from 'react-router';

import { DataTile } from 'src/components/common/DataTile';
import Container from 'src/components/layout/Container';
import { useAccountsPageContext } from './AccountsPageContext';
import { LoadableTable } from 'src/components/common/LoadableTable';
import { Badge } from 'src/components/common/Badge';
import { SortDropdown, SortOption } from 'src/components/common/SortDropdown';

import { formatDate } from 'src/utils/general';
import { ROUTES } from 'src/constants/routes';

import { AccountSortOption } from '@shared/types/accounts';
import { ACCOUNT_SORT_OPTIONS } from '@shared/constants/accounts';

const SORT_OPTIONS: SortOption<AccountSortOption>[] = [
  {
    label: 'Creation Date',
    value: ACCOUNT_SORT_OPTIONS.ACCOUNT_ID,
  },
  {
    label: 'FIO Balance',
    value: ACCOUNT_SORT_OPTIONS.BALANCE,
  },
  {
    label: 'Most Handles',
    value: ACCOUNT_SORT_OPTIONS.HANDLES,
  },
  {
    label: 'Most Domains',
    value: ACCOUNT_SORT_OPTIONS.DOMAINS,
  },
];

const columns = [
  {
    key: 'account',
    title: 'Account',
  },
  {
    key: 'handles',
    title: 'Handles',
  },
  {
    key: 'domains',
    title: 'Domains',
  },
  {
    key: 'fioBalance',
    title: 'FIO Balance',
  },
  {
    key: 'creationDate',
    title: 'Creation Date',
  },
];

const AccountsPage: FC = () => {
  const {
    loading,
    stats,
    accounts,
    accountsLoading,
    totalAccounts,
    sort,
    setSort,
    paginationProps
  } = useAccountsPageContext();

  const data = useMemo(() => {
    return accounts.map((account) => ({
      key: account.pk_account_id,
      account: (
        <Link to={`${ROUTES.accounts.path}/${account.account_name}`}>
          {account.account_name}
        </Link>
      ),
      handles: account.handle_count,
      domains: account.domain_count,
      fioBalance: <Badge variant='white'>{account.fio_balance_suf}</Badge>,
      creationDate: <Badge variant='white'>{formatDate(account.block_timestamp)}</Badge>,
    }));
  }, [accounts]);

  return (
    <Container className="py-3 py-md-5">
      <h4 className="mb-4">Accounts</h4>
      <p className="f-size-sm">
        Account Holders: <span className="text-dark fw-bold">{totalAccounts}</span>
      </p>
      <DataTile items={stats} columns={3} loading={loading} />
      <LoadableTable
        header={
          <div className="d-flex justify-content-between align-items-center gap-1 flex-wrap">
            <div className="text-nowrap">All Accounts</div>
            <div className="d-flex justify-content-md-between justify-content-end align-items-center gap-2 gap-md-5 flex-wrap">
              <SortDropdown
                options={SORT_OPTIONS}
                currentSort={sort}
                onSortChange={setSort}
              />
            </div>
          </div>
        }
        columns={columns}
        data={data}
        loading={accountsLoading}
        {...paginationProps}
        showInCardComponent
        className="mb-5"
      />
    </Container>
  );
};

export default AccountsPage;
