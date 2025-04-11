export interface Block {
  pk_block_number: number;
  stamp: string;
  block_id: string;
  producer_account_name: string;
  schedule_version: number;
  transaction_count: number;
}

export interface BlocksResponse {
  data: Block[];
  current_block: Block;
  total: number;
}

export interface CurrentBlockResponse {
  data: Block;
}
