import React from 'react';

import Container from '../../components/layout/Container';
import { TransactionPageComponent } from './TransactionPageComponent';
import { DataTile } from 'src/components/common/DataTile';
import { useTransactionsPageContext } from './TransactionsPageContext';

const TransactionsPage: React.FC = () => {
  const { stats, loading } = useTransactionsPageContext();

  return <Container title='Transactions'>
    <DataTile items={stats} layout='row' loading={loading}></DataTile>
    <TransactionPageComponent
      title="All Transactions"
      showInCardComponent={false}
      className='my-4'
    />
    </Container>;
};

export default TransactionsPage;
