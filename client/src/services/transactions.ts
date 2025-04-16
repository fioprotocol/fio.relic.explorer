import { Transaction, TransactionResponse, TransactionStats } from '@shared/types/transactions';
import { apiClient } from './api-client';

export const getTransactions = async (params: { offset: number, limit: number, block_number: number }): Promise<TransactionResponse> => {
  const response = await apiClient.get<TransactionResponse>('/transactions', { params });
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
