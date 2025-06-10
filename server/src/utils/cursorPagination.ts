import pool from '../config/database';

import { PAGINATION_DIRECTIONS, PaginationDirection } from '@shared/constants/pagination';
import { CursorResponse } from '@shared/types/general';

export interface CursorPaginationOptions {
  table: string;
  cursorColumn: string;
  orderDirection?: 'ASC' | 'DESC';
  limit: number;
  cursor?: string;
  direction?: PaginationDirection;
  whereClause?: string;
  whereValues?: unknown[];
  selectColumns?: string;
  joinClause?: string;
}

export interface CursorPaginationResult<T> extends CursorResponse<{ data: T[] }> {
  totalCount?: number;
}

export interface CursorInfo extends Omit<CursorResponse<{}>, 'total'> {}

/**
 * Generic cursor-based pagination utility for high-performance database queries
 * Optimized for tables with frequent insertions and large datasets
 */
export class CursorPagination {
  /**
   * Execute cursor-based pagination query
   */
  static async paginate<T>(options: CursorPaginationOptions): Promise<CursorPaginationResult<T>> {
    const {
      table,
      cursorColumn,
      orderDirection = 'DESC',
      limit,
      cursor,
      direction = PAGINATION_DIRECTIONS.NEXT,
      whereClause = '',
      whereValues = [],
      selectColumns = '*',
      joinClause = '',
    } = options;

    // Build the cursor condition based on direction and cursor value
    const cursorCondition = this.buildCursorCondition(cursor, cursorColumn, orderDirection, direction, whereValues.length);
    
    // Combine where clauses
    const combinedWhereClause = this.combineWhereClauses(whereClause, cursorCondition.condition);
    
    // Build the main query
    const query = this.buildQuery(
      table,
      selectColumns,
      joinClause,
      combinedWhereClause,
      cursorColumn,
      orderDirection,
      limit + 1 // Fetch one extra to determine if there are more pages
    );

    // Combine cursor values with existing where values
    const queryValues = [...whereValues, ...cursorCondition.values];

    // Execute the query
    const result = await pool.query(query, queryValues);
    let rows = result.rows as T[];

    // Determine pagination info
    const hasMorePages = rows.length > limit;
    if (hasMorePages) {
      rows = rows.slice(0, limit); // Remove the extra row
    }

    // For previous direction, reverse the results to maintain correct order
    if (direction === PAGINATION_DIRECTIONS.PREV) {
      rows.reverse();
    }

    // Calculate cursor info
    const cursorInfo = this.calculateCursorInfo(rows, cursorColumn, hasMorePages, direction, cursor);

    return {
      data: rows,
      ...cursorInfo,
    };
  }

  /**
   * Get total count for the query (optional, can be expensive)
   */
  static async getTotalCount(
    table: string,
    whereClause?: string,
    whereValues?: unknown[],
    joinClause?: string
  ): Promise<number> {
    const combinedWhereClause = whereClause ? `WHERE ${whereClause}` : '';
    const query = `
      SELECT COUNT(*) as total
      FROM ${table} ${joinClause || ''}
      ${combinedWhereClause}
    `;

    const result = await pool.query(query, whereValues || []);
    return parseInt(result.rows[0].total);
  }

  /**
   * Build cursor condition for WHERE clause
   */
  private static buildCursorCondition(
    cursor: string | undefined,
    cursorColumn: string,
    orderDirection: 'ASC' | 'DESC',
    direction: PaginationDirection,
    paramOffset: number = 0
  ): { condition: string; values: string[] } {
    if (!cursor) {
      return { condition: '', values: [] };
    }

    // Determine the comparison operator based on direction and order
    let operator: string;
    if (direction === PAGINATION_DIRECTIONS.NEXT) {
      operator = orderDirection === 'DESC' ? '<' : '>';
    } else {
      operator = orderDirection === 'DESC' ? '>' : '<';
    }

    return {
      condition: `${cursorColumn} ${operator} $${paramOffset + 1}`,
      values: [cursor],
    };
  }

  /**
   * Combine multiple WHERE clauses
   */
  private static combineWhereClauses(existingWhere: string, cursorWhere: string): string {
    const hasExisting = existingWhere.trim().length > 0;
    const hasCursor = cursorWhere.trim().length > 0;

    if (hasExisting && hasCursor) {
      return `WHERE ${existingWhere} AND ${cursorWhere}`;
    } else if (hasExisting) {
      return `WHERE ${existingWhere}`;
    } else if (hasCursor) {
      return `WHERE ${cursorWhere}`;
    }
    return '';
  }

  /**
   * Build the complete SQL query
   */
  private static buildQuery(
    table: string,
    selectColumns: string,
    joinClause: string,
    whereClause: string,
    cursorColumn: string,
    orderDirection: 'ASC' | 'DESC',
    limit: number
  ): string {
    return `
      SELECT ${selectColumns}
      FROM ${table} ${joinClause}
      ${whereClause}
      ORDER BY ${cursorColumn} ${orderDirection}
      LIMIT ${limit}
    `;
  }

  /**
   * Calculate cursor information for pagination
   */
  private static calculateCursorInfo<T>(
    rows: T[],
    cursorColumn: string,
    hasMoreInDirection: boolean,
    direction: PaginationDirection,
    currentCursor?: string
  ): CursorInfo {
    const isEmpty = rows.length === 0;
    
    if (isEmpty) {
      return {
        hasNextPage: false,
        hasPrevPage: !!currentCursor,
        nextCursor: null,
        prevCursor: null,
      };
    }

    const firstRow = rows[0] as Record<string, unknown>;
    const lastRow = rows[rows.length - 1] as Record<string, unknown>;

    const firstCursor = String(firstRow[cursorColumn]);
    const lastCursor = String(lastRow[cursorColumn]);

    if (direction === PAGINATION_DIRECTIONS.NEXT) {
      return {
        hasNextPage: hasMoreInDirection,
        hasPrevPage: !!currentCursor,
        nextCursor: hasMoreInDirection ? lastCursor : null,
        prevCursor: firstCursor,
      };
    } else {
      return {
        hasNextPage: !!currentCursor,
        hasPrevPage: hasMoreInDirection,
        nextCursor: lastCursor,
        prevCursor: hasMoreInDirection ? firstCursor : null,
      };
    }
  }
} 
