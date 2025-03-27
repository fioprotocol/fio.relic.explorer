import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import HealthCheckPage from './pages/HealthCheckPage';
import AboutPage from './pages/AboutPage';

import './styles/main.scss';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/health-check" element={<HealthCheckPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={
            <div className="container text-center mt-5">
              <h1>404 - Page Not Found</h1>
              <p>The page you are looking for does not exist.</p>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App; 