export interface NetworkOption {
  label: string;
  value: string;
}

export const DEFAULT_NETWORKS: NetworkOption[] = [
  { label: 'FIO Mainnet', value: 'mainnet' },
  { label: 'FIO Testnet', value: 'testnet' },
];

export const DEFAULT_NETWORK = DEFAULT_NETWORKS[0].value;
