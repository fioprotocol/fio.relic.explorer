import { FC } from 'react';

import { LoadableTable } from 'src/components/common/LoadableTable';

import { useTransactionsContext } from './TransactionsContext';

import { transactionsDesktop } from './TransactionsDesktop/TransactionsDesktop';
import { TransactionsMobile } from './TransactionsMobile/TransactionsMobile';

const COLUMNS = [
  {
    key: 'status',
    title: '',
  },
  {
    key: 'transaction_hash',
    title: 'Transaction Hash',
  },
  {
    key: 'date',
    title: 'Date',
  },
  {
    key: 'action',
    title: 'Action',
  },
  {
    key: 'details',
    title: 'Details / Items',
  },
  {
    key: 'fee',
    title: 'Fees',
    align: 'end',
  },
  {
    key: 'fio_tokens',
    title: 'FIO Tokens',
    align: 'end',
  },
];

export const Transactions: FC = () => {
  const { loading, transactions, paginationData } = useTransactionsContext();

  return (
    <LoadableTable
      columns={COLUMNS}
      data={transactionsDesktop({ transactions })}
      customMobileDesign={<TransactionsMobile transactions={transactions} />}
      loading={loading}
      showPagination
      {...paginationData}
    />
  );
};
