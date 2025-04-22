export interface Domain {
  pk_domain_id: number;
  domain_name: string;
  is_public: boolean;
  expiration_timestamp: string;
  domain_status: string;
  owner_account_name: string;
  owner_account_id: number;
  handle_count: number;
}

export interface DomainChainData {
  owner_account: string;
}

export interface DomainResponse {
  domain: Domain;
  chainData: DomainChainData;
}

export interface DomainsResponse {
  data: Domain[];
  total: number;
  all: number;
  active: number;
}
