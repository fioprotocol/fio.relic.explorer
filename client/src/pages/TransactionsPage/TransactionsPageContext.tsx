import { useState } from 'react';

type UseTransactionsPageContext = {
  transactions: any[];
};

export const useTransactionsPageContext = (): UseTransactionsPageContext => {
  const [transactions, setTransactions] = useState<any[]>([]);

  return { transactions };
};
