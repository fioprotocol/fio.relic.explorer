import { FC } from 'react';

import { useTransactionsContext } from './TransactionsContext';

import { Alert } from 'src/components/common/Alert';
import { Loader } from 'src/components/common/Loader';
import { LoadableTable } from 'src/components/common/LoadableTable';

import { transformTransactions } from 'src/utils/transactions';

import { TX_TABLE_COLUMNS } from 'src/pages/TransactionsPage/TxComponent';

const TRANSACTIONS_TABLE_COLUMNS = [...TX_TABLE_COLUMNS];
TRANSACTIONS_TABLE_COLUMNS.splice(
  TX_TABLE_COLUMNS.findIndex((column) => column.key === 'details'),
  1
);

export const Transactions: FC<{ handle: string }> = ({ handle }) => {
  const { transactions, loading, paginationData } = useTransactionsContext({ handle });

  if (!transactions) return <Loader />;
  if (!transactions.length) return <Alert hasDash={false} title="No transactions found" />;

  return (
    <LoadableTable
      columns={TRANSACTIONS_TABLE_COLUMNS}
      data={transactions.map(({ pk_handle_activity_id, ...rest }) =>
        transformTransactions({
          pk_transaction_id: `${pk_handle_activity_id}`,
          ...rest,
        })
      )}
      showPagination
      showInCardComponent={false}
      loading={loading}
      {...paginationData}
    />
  );
};

export default Transactions;
