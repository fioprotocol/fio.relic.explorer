import { ACCOUNT_SORT_OPTIONS } from '@shared/constants/accounts';
import { TransactionType } from './transactions';

export interface Account {
  pk_account_id: number;
  account_name: string;
  handle_count: number;
  domain_count: number;
  fio_balance_suf: string;
  block_timestamp: string;
}

export interface AccountDetails extends Account {
  public_key: string;
  fk_block_number: number;
}
export interface AccountResponse {
  data: AccountDetails;
}

export type AccountSortOption = typeof ACCOUNT_SORT_OPTIONS[keyof typeof ACCOUNT_SORT_OPTIONS];

export interface AccountsResponse {
  data: Account[];
  total: number;
}

export type AccountTransaction = {
  action_name: string;
  block_timestamp: string;
  fee: string;
  fio_tokens: string | null;
  pk_transaction_id: number;
  transaction_id: string;
  transaction_type: TransactionType;
  request_data: string;
}

export type AccountTransactionsResponse = {
  transactions: AccountTransaction[];
  total: number;
};
