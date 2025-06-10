// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = any;

// Generic cursor-based pagination response
export type CursorResponse<T> = {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextCursor: string | null;
  prevCursor: string | null;
  total?: number;
} & T;
