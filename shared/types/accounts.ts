import { ACCOUNT_SORT_OPTIONS } from '@shared/constants/accounts';

export interface Account {
  pk_account_id: number;
  account_name: string;
  handle_count: number;
  domain_count: number;
  fio_balance_suf: string;
  block_timestamp: string;
}

export type AccountSortOption = typeof ACCOUNT_SORT_OPTIONS[keyof typeof ACCOUNT_SORT_OPTIONS];

export interface AccountsResponse {
  data: Account[];
  total: number;
} 
