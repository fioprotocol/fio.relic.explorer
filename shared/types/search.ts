
// Define search result types
export type SearchResultType = 'account' | 'tx' | 'domain' | 'handle' | 'publicKey';

// Define search result interface
export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  data: Record<string, any>;
}

export interface SearchResponse {
  results: SearchResult[];
  totalCount?: number;
  page?: number;
  pageSize?: number;
}
