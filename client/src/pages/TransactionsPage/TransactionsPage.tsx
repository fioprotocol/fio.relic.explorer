import React from 'react';

import Container from '../../components/layout/Container';
import { TransactionPageComponent } from './TransactionPageComponent';
import { DataTile } from 'src/components/common/DataTile';
import { useTransactionsPageContext } from './TransactionsPageContext';
import { CardComponent } from 'src/components/layout/CardComponent';

const TransactionsPage: React.FC = () => {
  const { stats, loading } = useTransactionsPageContext();

  return <Container title='Transactions'>
    <DataTile items={stats} layout='row' loading={loading}></DataTile>
    <CardComponent className='mt-4 p-0 mb-4'>
      <TransactionPageComponent title="All Transactions" />
    </CardComponent>
    </Container>;
};

export default TransactionsPage;
