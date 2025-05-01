import { useParams } from 'react-router';
import Big from 'big.js';

import { useGetData } from 'src/hooks/useGetData';
import { getInfo, getTransactionHistoryData, ChainInfo } from 'src/services/fio';
import { getTransactionById } from 'src/services/transactions';
import { transformActionInfo, transformDetails } from 'src/utils/transactions';
import { DataItem } from 'src/components/common/DataTile';
import { formatFioAmount } from 'src/utils/fio';

import { TransactionHistoryResponse } from '@shared/types/fio-api-server';
import { TransactionDetailResponse, TransactionDetails } from '@shared/types/transactions';

type UseTransactionDetailsPageContext = {
  id: string | undefined;
  loading: boolean;
  transaction: TransactionDetails;
  isIrreversible: boolean;
  stats: DataItem[];
  rawData: TransactionHistoryResponse;
};

export const useTransactionDetailsPageContext = (): UseTransactionDetailsPageContext => {
  const { id } = useParams();

  const { response, loading } = useGetData<TransactionDetailResponse>({
    action: getTransactionById,
    params: { id },
  });

  const { response: chainInfo, loading: chainInfoLoading } = useGetData<ChainInfo>({ action: getInfo });

  const { response: rawData, loading: rawDataLoading } = useGetData<TransactionHistoryResponse>({ action: getTransactionHistoryData, params: { id } });

  const { action_name, account_name, block_number, fee, request_data } = response?.data || {};

  const isIrreversible =
    !!block_number &&
    !!chainInfo?.last_irreversible_block_num &&
    new Big(block_number).gt(chainInfo?.last_irreversible_block_num);

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
    { title: 'Account', value: account_name },
    { title: 'Fees', value: formatFioAmount({ amount: fee }) },
  ];

  return {
    id,
    loading: loading || rawDataLoading || chainInfoLoading,
    transaction: response?.data,
    isIrreversible,
    stats,
    rawData,
  };
};
