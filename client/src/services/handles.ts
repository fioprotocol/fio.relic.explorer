import { apiClient } from './api-client';

import {
  Handle,
  HandlesResponse,
  CursorHandlesResponse,
  HandleTransaction,
} from '@shared/types/handles';
import { CursorResponse } from '@shared/types/general';
import { PaginationDirection } from '@shared/constants/pagination';

// Implementation
export const getHandles = async (params: {
  offset?: number;
  cursor?: string;
  direction?: PaginationDirection;
  limit?: number;
  include_total?: boolean;
}): Promise<HandlesResponse | CursorHandlesResponse> => {
  const response = await apiClient.get<HandlesResponse | CursorHandlesResponse>('/handles', {
    params,
  });
  return response.data;
};

export const getHandle = async ({ handle }: { handle: string }): Promise<Handle> => {
  const { data } = await apiClient.get<Handle>(`/handles/${handle}`);

  return data;
};

// Cursor-based handle transactions
export type CursorHandleTransactionsResponse = CursorResponse<{ data: HandleTransaction[] }>;

export const getHandleTransactions = async ({
  handle,
  limit,
  cursor,
  direction,
}: {
  handle: string;
  limit?: number;
  cursor?: string;
  direction?: PaginationDirection;
}): Promise<CursorHandleTransactionsResponse> => {
  const { data } = await apiClient.get<CursorHandleTransactionsResponse>(
    `/handles/${handle}/transactions`,
    { params: { limit, cursor, direction } }
  );

  return data;
};
