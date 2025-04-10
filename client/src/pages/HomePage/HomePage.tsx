import React from 'react';

import Container from 'src/components/layout/Container';
import SearchContainer from 'src/components/Search/SearchContainer';
import { StatisticComponent } from 'src/components/StatisticComponent';
import { TransactionPageComponent } from 'src/pages/TransactionsPage/TransactionPageComponent';

import { useHomePageContext } from './HomePageContext';
import { useSearch } from 'src/hooks';

const HomePage: React.FC = () => {
  const { stats, chartData, loading } = useHomePageContext();
  const { handleSearch, query, isSearching } = useSearch();

  return (
    <>
      <SearchContainer
        onSearch={handleSearch}
        value={query}
        searching={isSearching}
        hovered={true}
      />
      <Container>
        <StatisticComponent stats={stats} chartData={chartData} loading={loading} />
        <div className='my-4'>
          <TransactionPageComponent showActionButton />
        </div>
      </Container>
    </>
  );
};

export default HomePage;
