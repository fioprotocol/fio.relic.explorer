import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import SearchNotFoundPage from './pages/SearchNotFoundPage';
import HealthCheckPage from './pages/HealthCheckPage';
import BlocksPage from './pages/BlocksPage';

import { ROUTES } from './constants/routes';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path={ROUTES.home.path} element={<HomePage />} />
          <Route path={ROUTES.searchNotFound.path} element={<SearchNotFoundPage />} />
          <Route path={ROUTES.blocks.path} element={<BlocksPage />} />
          <Route path={ROUTES.healthCheck.path} element={<HealthCheckPage />} />
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
