import BigNumber from 'big.js';
import { useParams } from 'react-router';

import { AccountResponse } from '@shared/types/accounts';
import { FioChainVoter, getProxyVotesDataResponse } from '@shared/types/fio-api-server';
import { FIO_SUF_UNITS } from '@shared/constants/fio';

import { DataItem } from 'src/components/common/DataTile/DataTile';
import { useGetData } from 'src/hooks/useGetData';
import useProducers from 'src/hooks/useProducers';
import { getAccount } from 'src/services/accounts';
import { getProxyVotesData, getFioBalance, FioBalanceResponse } from 'src/services/fio';
import { getROE } from 'src/services/roe';
import { getProxies, Producer, Proxy } from 'src/services/bpmonitor';
import { formatFioAmount } from 'src/utils/fio';
import { formatUsdValue } from 'src/utils/general';
import { transformBlockProducer } from 'src/utils/bpmonitor';
import { BlockProducerProps } from 'src/pages/BlockProducersPage/types';

// Helper functions
const calculateFioBalanceValue = (balance?: number, roe?: string): string => {
  if (!balance || !roe) return '';
  
  // Convert number to string for BigNumber to avoid precision issues
  const balanceStr = String(balance);
  const balanceValue = new BigNumber(balanceStr).div(FIO_SUF_UNITS).times(roe).toNumber();
  
  return `${formatUsdValue({ value: balanceValue })} @ ${formatUsdValue({ value: roe, maximumFractionDigits: 4 })}`;
};

const calculateLockedFio = (fioBalance?: FioBalanceResponse): string => {
  if (!fioBalance) return '';
  
  // Convert the numbers to strings for BigNumber
  const balance = String(fioBalance.balance);
  const available = String(fioBalance.available);
  
  const lockedAmount = new BigNumber(balance).minus(available).toString();
  return formatFioAmount({ amount: lockedAmount, hasFullAmount: true });
};

const calculateAccruedStakingRewards = (fioBalance?: FioBalanceResponse): string => {
  if (!fioBalance) return '';
  
  // Type safety for BigNumber calculations
  const srps = String(fioBalance.srps);
  const roe = fioBalance.roe || '0';
  const staked = String(fioBalance.staked);
  
  const amount = new BigNumber(srps).mul(roe).minus(staked).mul(0.9).toString();
  
  return formatFioAmount({ amount, hasFullAmount: true });
};

type UseAccountDetailsPageContext = {
  account?: string;
  blockNumber?: number;
  date?: string;
  loading: boolean;
  publicKey?: string;
  stats: DataItem[];
  isBlockProducer: boolean;
  isProxy: boolean;
  producers: BlockProducerProps[];
  proxy: Proxy | null;
  votes: FioChainVoter[];
  votingProxy: string | null;
};

export const useAccountDetailsPageContext = (): UseAccountDetailsPageContext => {
  const { id: account } = useParams();

  const { response: chainData, loading: chainDataLoading } = useGetData<getProxyVotesDataResponse>({
    action: getProxyVotesData,
    params: { accountName: account },
  });

  const { response: accountData, loading: accountDataLoading } = useGetData<AccountResponse>({
    action: getAccount,
    params: { account },
  });

  const publicKey = accountData?.data?.public_key;

  const { response: fioBalance, loading: fioBalanceLoading } = useGetData<FioBalanceResponse>({
    action: getFioBalance,
    params: { fioPublicKey: publicKey },
    ready: !!publicKey,
  });

  const { response: roe, loading: roeLoading } = useGetData<string>({
    action: getROE,
    params: { accountName: account },
  });

  const { producers, loading: producersLoading } = useProducers();

  const isProxy = !!chainData?.voters?.rows?.some((voter) => voter.is_proxy === 1);

  const { response: proxies, loading: proxiesLoading } = useGetData<Proxy[]>({
    action: getProxies,
    ready: isProxy,
  });

  const stats: DataItem[] = [
    {
      title: 'Total FIO Balance',
      value: formatFioAmount({ amount: fioBalance?.balance, hasFullAmount: true }),
    },
    {
      title: 'Total FIO Balance Value',
      value: calculateFioBalanceValue(fioBalance?.balance, roe),
    },
    {
      title: 'Available FIO',
      value: formatFioAmount({ amount: fioBalance?.available, hasFullAmount: true }),
    },
    {
      title: 'Locked FIO',
      value: calculateLockedFio(fioBalance),
    },
    {
      title: 'Staked FIO',
      value: formatFioAmount({ amount: fioBalance?.staked, hasFullAmount: true }),
    },
    {
      title: 'Accrued Staking Rewards',
      value: calculateAccruedStakingRewards(fioBalance),
    },
  ];

  const voters = chainData?.voters?.rows || [];
  const votingProxy =
    voters.find((voter) => voter.is_auto_proxy === 1 || !!voter.proxy)?.proxy || null;

  const transformedProducers =
    voters[0]?.producers?.map((producerAccountName) =>
      transformBlockProducer({
        producer: producers.get(producerAccountName) as Producer,
        bpMonitorProducers: producers,
      })
    ) || [];

  return {
    account,
    blockNumber: accountData?.data?.fk_block_number,
    date: accountData?.data?.block_timestamp,
    loading:
      chainDataLoading ||
      accountDataLoading ||
      fioBalanceLoading ||
      roeLoading ||
      proxiesLoading ||
      producersLoading,
    publicKey,
    votingProxy,
    votes: voters,
    producers: transformedProducers,
    stats,
    isBlockProducer: !!chainData?.producers?.rows?.some((producer) => producer.is_active === 1),
    isProxy,
    proxy: proxies?.find((proxy) => proxy.owner === account) || null,
  };
};
