/**
 * Pagination constants for consistent usage across client and server
 */
export const PAGINATION_LABELS = {
  FIRST: 'First',
  PREVIOUS: 'Previous', 
  NEXT: 'Next',
  LAST: 'Last',
} as const;

/**
 * Pagination navigation directions for cursor-based pagination
 */
export const PAGINATION_DIRECTIONS = {
  NEXT: 'next',
  PREV: 'prev',
  FIRST: 'first',
  LAST: 'last',
} as const;

export type PaginationDirection = typeof PAGINATION_DIRECTIONS[keyof typeof PAGINATION_DIRECTIONS];

/**
 * Pagination modes
 */
export const PAGINATION_MODES = {
  OFFSET: 'offset',
  CURSOR: 'cursor',
} as const;

export type PaginationMode = typeof PAGINATION_MODES[keyof typeof PAGINATION_MODES]; 
