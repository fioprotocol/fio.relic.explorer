import { TRANSACTION_TYPE } from '../constants/transaction';
import { CursorResponse } from './general';

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

// Cursor-based pagination response
export type CursorTransactionResponse = CursorResponse<{
  transactions: Transaction[];
}>;

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

export type TokenTransfer = {
  payer_account_name: string;
  payer_public_key: string;
  payee_account_name: string;
  payee_public_key: string;
  amount: string;
  memo: string;
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
  token_transfers?: TokenTransfer[];
};

export type TransactionType = typeof TRANSACTION_TYPE[keyof typeof TRANSACTION_TYPE];
