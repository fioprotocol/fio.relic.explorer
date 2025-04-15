import React, { useState } from 'react';

import TopBar from './TopBar';
import Header from './Header';
import Footer from './Footer';

import { useGetData } from 'src/hooks/useGetData';

import { fetchPrice, getInfo, ChainInfo } from 'src/services/fio';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [network, setNetwork] = useState('mainnet');
  const { response: price } = useGetData({ action: fetchPrice });
  const { response: chainInfo }: { response: ChainInfo } = useGetData({ action: getInfo });
  const chainId = chainInfo?.chain_id || '-';

  const onNetworkChange = (network: string): void => {
    setNetwork(network);
  };

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
