import { FC } from 'react';

import { LoadableTable } from 'src/components/common/LoadableTable';
import { useTransactionsComponentContext } from './TransactionsComponentContext';

const columns = [
  { key: 'transactionId', title: 'Transaction ID' },
  { key: 'account', title: 'Account' },
  { key: 'date', title: 'Date' },
  { key: 'action', title: 'Action' },
  { key: 'details', title: 'Details / Items' },
  { key: 'fee', title: 'Fees' },
];

export const TransactionPageComponent: FC<{ title?: string }> = ({ title }) => {
  const { transactions, loading, loadMore, hasMore } = useTransactionsComponentContext();

  return (
    <LoadableTable
      columns={columns}
      data={transactions || []}
      title={title || 'Transactions'}
      loadMore={loadMore}
      hasMore={hasMore}
      isLoading={loading}
    />
  );
};
