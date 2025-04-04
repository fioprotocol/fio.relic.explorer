import axios from 'axios';

import { SearchResult, SearchResponse } from 'shared/types/search';

export const searchService = {
  /**
   * Search across accounts, transactions, domains, handles, and public keys
   */
  search: async (query: string): Promise<SearchResponse> => {
    try {
      const response = await axios.get<SearchResponse>('/api/search', {
        params: {
          q: query
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching:', error);
      throw error;
    }
  },

  /**
   * Search for a specific type of data
   */
  searchByType: async (
    query: string, 
    type: SearchResult['type'], 
    page = 1, 
    pageSize = 10
  ): Promise<SearchResponse> => {
    try {
      const response = await axios.get<SearchResponse>(`/api/search/${type}`, {
        params: {
          q: query,
          page,
          pageSize
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error searching for ${type}:`, error);
      throw error;
    }
  }
};

export default searchService; 
