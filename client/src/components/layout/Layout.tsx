import React, { useState } from 'react';
import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [network, setNetwork] = useState('mainnet');

  const onNetworkChange = (network: string) => {
    setNetwork(network);
  };

  return (
    <div className="layout">
      <TopBar selectedNetwork={network} onNetworkChange={onNetworkChange} />
      <Header />
      <main className="main-content py-4">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
