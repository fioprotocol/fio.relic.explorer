import React, { useEffect, useState } from 'react';

import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [network, setNetwork] = useState('mainnet');
  const [price, setPrice] = useState('');
  const [chainId, setChainId] = useState('-');

  const onNetworkChange = (network: string): void => {
    setNetwork(network);
  };

  const fetchPrice = async (): Promise<void> => {
    try {
      const response = await fetch('https://app.fio.net/api/v1/reg/prices?actual=false');
      const data = await response.json();
      setPrice(data.data.pricing.usdtRoe);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchChainId = async (): Promise<void> => {
    try {
      const response = await fetch('https://fio.eosusa.io/v1/chain/get_info');
      const data = await response.json();
      setChainId(data.chain_id);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPrice();
    fetchChainId();
  }, []);

  return (
    <div className="layout">
      <TopBar
        selectedNetwork={network}
        onNetworkChange={onNetworkChange}
        price={price}
        chainId={chainId}
      />
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
