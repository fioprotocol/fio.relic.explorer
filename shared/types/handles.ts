export interface Handle {
  pk_handle_id: number;
  handle: string;
  encryption_key: string;
  is_encrypt_key_set: boolean;
  bundled_tx_count: number;
  expiration_stamp: string;
  handle_status: 'active' | 'burnt';
  owner_account_name: string;
  owner_account_id: string;
  domain_name: string;
}

export interface HandlesResponse {
  data: Handle[];
  total: number;
  all: number;
  active: number;
}
