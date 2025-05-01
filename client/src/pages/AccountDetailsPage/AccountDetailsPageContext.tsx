import BigNumber from 'big.js';

import { AccountResponse } from '@shared/types/accounts';
import { getProxyVotesDataResponse } from '@shared/types/fio-api-server';
import { useParams } from 'react-router';
import { DataItem } from 'src/components/common/DataTile/DataTile';
import { useGetData } from 'src/hooks/useGetData';
import { getAccount } from 'src/services/accounts';
import { getProxyVotesData, getFioBalance, FioBalanceResponse } from 'src/services/fio';
import { formatFioAmount } from 'src/utils/fio';
import { getROE } from 'src/services/roe';
import { FIO_SUF_UNITS } from '@shared/constants/fio';
import { formatUsdValue } from 'src/utils/general';

type UseAccountDetailsPageContext = {
  account?: string;
  blockNumber?: number;
  date?: string;
  loading: boolean;
  publicKey?: string;
  stats: DataItem[];
  isBlockProducer: boolean;
  isProxy: boolean;
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

  const { response: fioBalance, loading: fioBalanceLoading } = useGetData<FioBalanceResponse>({
    action: getFioBalance,
    params: { fioPublicKey: accountData?.data?.public_key },
    ready: !!accountData?.data?.public_key,
  });

  const { response: roe, loading: roeLoading } = useGetData<string>({
    action: getROE,
    params: { accountName: account },
  });

  const stats: DataItem[] = [
    {
      title: 'Total FIO Balance',
      value: formatFioAmount({ amount: fioBalance?.balance, hasFullAmount: true }),
    },
    {
      title: 'Total FIO Balance Value',
      value:
        fioBalance && roe
          ? `${formatUsdValue({ value: new BigNumber(fioBalance?.balance).div(FIO_SUF_UNITS).times(roe).toNumber() })} @ ${formatUsdValue({ value: roe, maximumFractionDigits: 4 })}`
          : '',
    },
    {
      title: 'Available FIO',
      value: formatFioAmount({ amount: fioBalance?.available, hasFullAmount: true }),
    },
    {
      title: 'Locked FIO',
      value:
        fioBalance
          ? formatFioAmount({
            amount: new BigNumber(fioBalance?.balance).minus(fioBalance?.available).toString(),
            hasFullAmount: true,
          })
          : '',
    },
    {
      title: 'Staked FIO',
      value: formatFioAmount({ amount: fioBalance?.staked, hasFullAmount: true }),
    },
    {
      title: 'Accrued Staking Rewards',
      value: fioBalance
        ? formatFioAmount({
          amount: new BigNumber(fioBalance?.srps).mul(fioBalance?.roe || 0).minus(fioBalance?.staked).mul(0.9),
          hasFullAmount: true,
        })
        : '',
    },
  ];

  return {
    account,
    blockNumber: accountData?.data?.fk_block_number,
    date: accountData?.data?.block_timestamp,
    loading: chainDataLoading || accountDataLoading || fioBalanceLoading || roeLoading,
    publicKey: accountData?.data?.public_key,
    stats,
    isBlockProducer:
      chainData?.producers?.rows?.length > 0 && chainData?.producers.rows[0].is_active === 1,
    isProxy: chainData?.voters?.rows?.length > 0 && chainData?.voters.rows[0].is_proxy === 1,
  };
};
