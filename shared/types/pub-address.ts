export interface PubAddress {
  token_code: string;
  chain_code: string;
  public_address: string;
}

export type ChainCode = {
  chain_code: string;
  name: string;
  multi_level_parameters: string;
  slip44_index: string;
  eip_155_chain_id: string;
  coingecko_platform_id: string;
};

export type TokenCode = {
  chain_code: string;
  token_code: string;
  name: string;
  contract_address: string;
  coingecko_token_id: string;
};

export type ChainCodeMap = Record<string, ChainCode>;
export type TokenCodeMap = Record<string, TokenCode>;
