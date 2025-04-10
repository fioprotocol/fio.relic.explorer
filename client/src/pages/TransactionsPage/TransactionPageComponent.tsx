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

type TransactionPageComponentProps = {
  title?: string;
  showActionButton?: boolean;
};

export const TransactionPageComponent: FC<TransactionPageComponentProps> = ({
  title,
  showActionButton = false,
}) => {
  const { transactions, loading, onActionButtonClick } = useTransactionsComponentContext();

  return (
    <LoadableTable
      columns={columns}
      data={transactions || []}
      title={title || 'Transactions'}
      showActionButton={showActionButton}
      actionButtonText="VIEW ALL TRANSACTIONS"
      isLoading={loading}
      onActionButtonClick={onActionButtonClick}
    />
  );
};
