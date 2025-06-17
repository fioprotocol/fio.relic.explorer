import { ACCOUNT_SORT_OPTIONS } from '@shared/constants/accounts';
import { TransactionType } from './transactions';
import { CursorResponse } from './general';

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

// Cursor-based pagination response for accounts
export type CursorAccountsResponse = CursorResponse<{ data: Account[] }>;

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

// Cursor-based pagination response for account transactions
export type CursorAccountTransactionsResponse = CursorResponse<{ data: AccountTransaction[] }>;

export type AccounFioHandle = {
  handle: string;
  handle_status: string;
};

export type AccountDomain = {
  domain_name: string;
  is_public: boolean;
  handles_count: number;
  status: string;
  expiration_timestamp: string;
};

// Cursor-based pagination responses for account-related resources
export type CursorAccountFioHandlesResponse = CursorResponse<{ data: AccounFioHandle[] }>;

export type CursorAccountDomainsResponse = CursorResponse<{ data: AccountDomain[] }>;
