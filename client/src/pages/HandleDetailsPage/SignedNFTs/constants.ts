export const NETWORKS_LIST: {
  [key: string]: { name: string; currency: string; chainID: number };
} = {
  Ethereum: {
    name: 'Ethereum Mainnet',
    currency: 'ETH',
    chainID: 1,
  },
  Rinkeby: {
    name: 'Rinkeby',
    currency: 'RIN',
    chainID: 4,
  },
  Sepolia: {
    name: 'Sepolia',
    currency: 'SETH',
    chainID: 11155111,
  },
  Polygon: {
    name: 'Polygon Mainnet',
    currency: 'POL',
    chainID: 137,
  },
  Amoy: {
    name: 'Polygon Testnet',
    currency: 'POLYGON',
    chainID: 80002,
  },
  ArbitrumOne: {
    name: 'ArbitrumOne',
    currency: 'ARB1',
    chainID: 42161,
  },
  BinanceSmartChain: {
    name: 'Binance Smart Chain',
    currency: 'BSC',
    chainID: 56,
  },
  Avalanche: {
    name: 'Avalanche',
    currency: 'AVAX',
    chainID: 43114,
  },
  Fantom: {
    name: 'Fantom',
    currency: 'FTM',
    chainID: 250,
  },
};

export const NETWORK_CHAIN_ID_MAP: { [key: string]: number } = {};

for (const network in NETWORKS_LIST) {
  const { currency, chainID } = NETWORKS_LIST[network];
  if (currency === NETWORKS_LIST['Polygon'].currency) {
    NETWORK_CHAIN_ID_MAP[currency] = NETWORKS_LIST['Polygon'].chainID;
  } else {
    NETWORK_CHAIN_ID_MAP[currency] = chainID;
  }
}

export const INFURA_HOST_URL = 'ipfs.infura.io';
export const INFURA_IFPS_LINK = /ipfs:\/\//g;
export const REWRITE_INFURA_HOST_URL = 'fio.infura-ipfs.io';

export const DEFAULT_LIMIT = 6;
