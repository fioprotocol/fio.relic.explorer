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
  fee: number;
  request_data: string;
  response_data: string;
  result_status: string;
};

export type TransactionResponse = {
  transactions: Transaction[];
  total: number;
  offset: number;
  limit: number;
};

export type TransformedTransaction = {
  id: string;
  transactionId: React.ReactNode;
  account: React.ReactNode;
  date: string;
  action: string;
  details: string;
  fee: string;
};

export type TransactionStats = {
  transactionsCount: number;
  transactionFees: string;
  avgTransactionFee: string;
};
