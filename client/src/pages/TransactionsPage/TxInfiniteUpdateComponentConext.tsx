import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { ROUTES } from 'src/constants/routes';
import { getTransactions } from 'src/services/transactions';
import { transformTransactions } from 'src/utils/transactions';
import { useGetData } from 'src/hooks/useGetData';

import { DEFAULT_REFRESH_INTERVAL } from 'src/constants/general';

import { DEFAULT_REQUEST_ITEMS_LIMIT } from '@shared/constants/network';
import { TransformedTransaction, Transaction } from '@shared/types/transactions';

type UseTxInfiniteUpdateConextProps = {
  transactions: TransformedTransaction[];
  loading: boolean;
  onActionButtonClick: () => void;
};

export const useTxInfiniteUpdateConext = (): UseTxInfiniteUpdateConextProps => {
  const navigate = useNavigate();

  const onActionButtonClick = useCallback(() => {
    navigate(ROUTES.transactions.path);
  }, [navigate]);

  const { response, loading } = useGetData({
    action: getTransactions,
    params: { limit: DEFAULT_REQUEST_ITEMS_LIMIT, offset: 0 },
    interval: DEFAULT_REFRESH_INTERVAL,
  });

  const transactions =
    response?.transactions.map((transaction: Transaction) => transformTransactions(transaction)) ||
    [];

  return {
    loading: loading && transactions.length === 0,
    transactions,
    onActionButtonClick,
  };
};
