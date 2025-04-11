import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';

import { ROUTES } from 'src/constants/routes';
import { getTransactions } from 'src/services/transactions';
import { transformTransactions } from 'src/utils/transactions';
import useInterval from 'src/hooks/useInterval';
import { DEFAULT_REFRESH_INTERVAL } from 'src/constants/general';

import { DEFAULT_REQUEST_ITEMS_LIMIT } from '@shared/constants/network';
import { TransformedTransaction } from '@shared/types/transactions';

type UseTxInfiniteUpdateConextProps = {
  transactions: TransformedTransaction[];
  loading: boolean;
  onActionButtonClick: () => void;
};

export const useTxInfiniteUpdateConext = (): UseTxInfiniteUpdateConextProps => {
  
  const [transactions, setTransactions] = useState<TransformedTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onActionButtonClick = useCallback(() => {
    navigate(ROUTES.transactions.path);
  }, [navigate]);

  const fetchTransactinos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getTransactions({ limit: DEFAULT_REQUEST_ITEMS_LIMIT, offset: 0 });

      const transformedTransactions = response?.transactions.map(transaction => transformTransactions(transaction)) || [];
      setTransactions(transformedTransactions);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useInterval(fetchTransactinos, DEFAULT_REFRESH_INTERVAL, { callImmediately: true });

  return {
    loading: loading && transactions.length === 0,
    transactions,
    onActionButtonClick
  };
};
