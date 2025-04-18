import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import SearchNotFoundPage from './pages/SearchNotFoundPage';
import HealthCheckPage from './pages/HealthCheckPage';
import BlocksPage from './pages/BlocksPage';
import BlockDetailsPage from './pages/BlockDetailsPage';
import TransactionsPage from './pages/TransactionsPage';
import TransactionDetailsPage from './pages/TransactionDetailsPage';
import HandlesPage from './pages/HandlesPage';
import HandleDetailsPage from './pages/HandleDetailsPage';
import BlockProducersPage from './pages/BlockProducersPage';

import { ROUTES } from './constants/routes';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path={ROUTES.home.path} element={<HomePage />} />
          <Route path={ROUTES.searchNotFound.path} element={<SearchNotFoundPage />} />
          <Route path={ROUTES.blocks.path} element={<BlocksPage />} />
          <Route path={ROUTES.block.path} element={<BlockDetailsPage />} />
          <Route path={ROUTES.healthCheck.path} element={<HealthCheckPage />} />
          <Route path={ROUTES.transactions.path} element={<TransactionsPage />} />
          <Route path={ROUTES.transaction.path} element={<TransactionDetailsPage />} />
          <Route path={ROUTES.handles.path} element={<HandlesPage />} />
          <Route path={ROUTES.handle.path} element={<HandleDetailsPage />} />
          <Route path={ROUTES.producers.path} element={<BlockProducersPage />} />
          <Route
            path="*"
            element={
              <div className="container text-center mt-5">
                <h1>404 - Page Not Found</h1>
                <p>The page you are looking for does not exist.</p>
              </div>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
