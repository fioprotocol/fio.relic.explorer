import { Link, useParams } from 'react-router';

import { useGetData } from 'src/hooks/useGetData';
import { getInfo, getTransactionHistoryData, ChainInfo } from 'src/services/fio';
import { getTransactionById } from 'src/services/transactions';
import { transformActionInfo, transformDetails } from 'src/utils/transactions';
import { DataItem } from 'src/components/common/DataTile';
import { formatFioAmount } from 'src/utils/fio';
import { ROUTES } from 'src/constants/routes';

import { TransactionHistoryResponse } from '@shared/types/fio-api-server';
import { TransactionDetailResponse, TransactionDetails } from '@shared/types/transactions';

type UseTransactionDetailsPageContext = {
  id: string | undefined;
  loading: boolean;
  transaction: TransactionDetails;
  lastIrreversibleBlockNumber: number | null;
  stats: DataItem[];
  rawData: TransactionHistoryResponse;
};

export const useTransactionDetailsPageContext = (): UseTransactionDetailsPageContext => {
  const { id } = useParams();

  const { response, loading } = useGetData<TransactionDetailResponse>({
    action: getTransactionById,
    params: { id },
  });

  const { response: chainInfo, loading: chainInfoLoading } = useGetData<ChainInfo>({
    action: getInfo,
  });

  const { response: rawData, loading: rawDataLoading } = useGetData<TransactionHistoryResponse>({
    action: getTransactionHistoryData,
    params: { id },
  });

  const { action_name, account_name, fee, request_data } = response?.data || {};

  const actionInfo = transformActionInfo(action_name);

  const stats: DataItem[] = [
    {
      title: 'Action',
      value: actionInfo.description,
    },
    {
      title: 'Details/Item',
      value: loading ? null : transformDetails({ actionInfo, request_data }) || ' - ',
    },
    {
      title: 'Account',
      value: <Link to={`${ROUTES.accounts.path}/${account_name}`}>{account_name}</Link>,
    },
    { title: 'Fees', value: formatFioAmount({ amount: fee }) },
  ];

  return {
    id,
    loading: loading || rawDataLoading || chainInfoLoading,
    transaction: response?.data,
    lastIrreversibleBlockNumber: chainInfo?.last_irreversible_block_num,
    stats,
    rawData,
  };
};
