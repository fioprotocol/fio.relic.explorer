import {
  Transaction,
  TransactionResponse,
  CursorTransactionResponse,
  TransactionStats,
} from '@shared/types/transactions';
import { PaginationDirection } from '@shared/constants/pagination';

import { apiClient } from './api-client';

// Implementation
export const getTransactions = async (params: {
  offset?: number;
  cursor?: string;
  direction?: PaginationDirection;
  limit?: number;
  block_number?: number;
  include_total?: boolean;
}): Promise<TransactionResponse | CursorTransactionResponse> => {
  const response = await apiClient.get<TransactionResponse | CursorTransactionResponse>(
    '/transactions',
    { params }
  );
  return response.data;
};

export const getTransactionById = async ({ id }: { id: string }): Promise<Transaction> => {
  const response = await apiClient.get<Transaction>(`/transactions/${id}`);
  return response.data;
};

export const getTransactionStats = async (params: { days: number }): Promise<TransactionStats> => {
  const response = await apiClient.get<TransactionStats>('/transactions/stats', { params });
  return response.data;
};
