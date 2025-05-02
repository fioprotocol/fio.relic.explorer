import { TRANSACTION_TYPE } from '../constants/transaction';

export type Transaction = {
  pk_transaction_id: string;
  fk_block_number: number;
  block_timestamp: string;
  transaction_id: string;
  fk_action_account_id: string;
  fk_account_id: string;
  account_name: string;
  action_name: string;
  tpid: string;
  fee: string;
  request_data: string;
  response_data: string;
  result_status: string;
};

export type TransactionResponse = {
  transactions: Transaction[];
  total: number;
};

export type TransformedTransaction = {
  id: string;
  transactionId: React.ReactNode;
  account: React.ReactNode;
  date: string;
  action: string;
  details: string | null;
  fee: string;
};

export type TransactionStats = {
  transactionsCount: number;
  transactionFees: string;
  avgTransactionFee: string;
};

export type TransactionDetailResponse = {
  data: TransactionDetails;
};

export type TransactionDetails = {
  transaction_id: string;
  block_timestamp: string;
  block_number: number;
  action_name: string;
  account_name: string;
  result_status: string;
  request_data: string;
  response_data: string;
  fee: number;
  contract_action_name: string;
  traces: {
    account_name: string;
    action_name: string;
    request_data: string;
  }[];
};

export type TransactionType = typeof TRANSACTION_TYPE[keyof typeof TRANSACTION_TYPE];
