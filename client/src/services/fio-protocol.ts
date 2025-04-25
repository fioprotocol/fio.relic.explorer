import axios from 'axios';
import { getROE } from './roe';

const FIO_PROTOCOL_API_URL = 'https://services-external.fioprotocol.io';

type CurrentTokenSupplyResponse = {
  total_supply: number;
};

type TokenCirculatingSupplyResponse = {
  circulating_supply: number;
};

export type StakingResponse = {
  staked_token_pool: number;
  outstanding_srps: number;
  rewards_token_pool: number;
  combined_token_pool: number;
  staking_rewards_reserves_minted: number;
  roe: number;
  active: boolean;
};

type LockedTokensResponse = {
  locked_tokens: number;
};

export type AccountStatsResponse = {
  currentTokenSupply: number;
  tokenCirculatingSupply: number;
  stakedFio: number;
  lockedTokens: number;
  roe: string;
};

export const getCurrentTokenSupply = async (): Promise<number> => {
  const response = await axios.get<CurrentTokenSupplyResponse>(`${FIO_PROTOCOL_API_URL}/supply?json=true`);

  return response.data?.total_supply;
};

export const getTokenCirculatingSupply = async (): Promise<number> => {
  const response = await axios.get<TokenCirculatingSupplyResponse>(`${FIO_PROTOCOL_API_URL}/circulating?json=true`);

  return response.data?.circulating_supply;
};

export const getStaking = async (): Promise<StakingResponse> => {
  const response = await axios.get<StakingResponse>(`${FIO_PROTOCOL_API_URL}/staking`);

  return response.data;
};

export const getLockedTokens = async (): Promise<number> => {
  const response = await axios.get<LockedTokensResponse>(`${FIO_PROTOCOL_API_URL}/locked?json=true`);

  return response.data?.locked_tokens;
};

export const getAccountStats = async (): Promise<AccountStatsResponse> => {
  const currentTokenSupply = await getCurrentTokenSupply();
  const tokenCirculatingSupply = await getTokenCirculatingSupply();
  const stakingResponse = await getStaking();
  const lockedTokens = await getLockedTokens();
  const roe = await getROE();

  return {
    currentTokenSupply,
    tokenCirculatingSupply,
    stakedFio: stakingResponse?.staked_token_pool,
    lockedTokens,
    roe,
  };
};
