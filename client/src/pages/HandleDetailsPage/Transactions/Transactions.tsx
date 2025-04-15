import { FC } from 'react';

import { useTransactionsContext } from './TransactionsContext';

import { LoadableTable } from 'src/components/common/LoadableTable';

import { transformTransactions } from 'src/utils/transactions';

import { TX_TABLE_COLUMNS } from 'src/pages/TransactionsPage/TxComponent';

const TRANSACTIONS_TABLE_COLUMNS = [...TX_TABLE_COLUMNS];
TRANSACTIONS_TABLE_COLUMNS.splice(
  TX_TABLE_COLUMNS.findIndex((column) => column.key === 'details'),
  1
);

export const Transactions: FC<{ handle: string }> = ({ handle }) => {
  const { transactions, ...paginationProps } = useTransactionsContext({ handle });

  return transactions.length > 0 ? (
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
      {...paginationProps}
    />
  ) : (
    <span>No transactions found</span>
  );
};

export default Transactions;
