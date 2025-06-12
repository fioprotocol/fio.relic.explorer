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
  resultField?: string;
  isTimestampSort?: boolean;
}

export interface CursorPaginationResult<T> extends CursorResponse<{ data: T[] }> {
  totalCount?: number;
}

export interface CursorInfo extends Omit<CursorResponse<{}>, 'total'> {}

interface BuildCursorConditionParams {
  cursor?: string;
  cursorColumn: string;
  orderDirection: 'ASC' | 'DESC';
  direction: PaginationDirection;
  paramOffset?: number;
  isTimestampSort?: boolean;
}

interface BuildQueryParams {
  table: string;
  selectColumns: string;
  joinClause: string;
  whereClause: string;
  cursorColumn: string;
  orderDirection: 'ASC' | 'DESC';
  limit: number;
}

interface GetTotalCountParams {
  table: string;
  whereClause?: string;
  whereValues?: unknown[];
  joinClause?: string;
}

interface CombineWhereClausesParams {
  existingWhere: string;
  cursorWhere: string;
}

interface CalculateCursorInfoParams<T> {
  rows: T[];
  cursorColumn: string;
  hasMoreInDirection: boolean;
  direction: PaginationDirection;
  currentCursor?: string;
  resultField?: string;
  isTimestampSort?: boolean;
}

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
      resultField,
      isTimestampSort = false
    } = options;

    // For last page (PREV without cursor), we need to get the total count first
    if (direction === PAGINATION_DIRECTIONS.PREV && !cursor) {
      const totalCount = await this.getTotalCount({
        table,
        whereClause,
        whereValues,
        joinClause
      });

      // Calculate the offset to get the last page
      const offset = Math.max(0, totalCount - limit);
      
      // For last page, we need to use the original order
      const query = `
        SELECT ${selectColumns}
        FROM ${table} ${joinClause}
        ${whereClause ? `WHERE ${whereClause}` : ''}
        ORDER BY ${cursorColumn.split(', ').join(` ${orderDirection}, `)} ${orderDirection}
        LIMIT ${limit}
        OFFSET ${offset}
      `;

      const result = await pool.query(query, whereValues);
      let rows = result.rows as T[];

      // Handle cursor extraction for composite columns
      let prevCursorValue: string | null = null;
      if (offset > 0 && rows.length > 0) {
        if (cursorColumn.includes(', ') && isTimestampSort) {
          const [timestampCol, idCol] = cursorColumn.split(', ');
          const timestampField = timestampCol.split('.').pop()!;
          const idField = idCol.split('.').pop()!;
          const firstRow = rows[0] as Record<string, unknown>;

          prevCursorValue = JSON.stringify({
            sortValue: firstRow[timestampField],
            pk_domain_id: firstRow[idField]
          });
        } else {
          prevCursorValue = this.extractCursorValue(rows[0] as Record<string, unknown>, cursorColumn, resultField);
        }
      }

      return {
        data: rows,
        hasNextPage: false,
        hasPrevPage: offset > 0,
        nextCursor: null,
        prevCursor: prevCursorValue,
        totalCount
      };
    }

    // Rest of the pagination logic for normal cases
    const { condition: cursorCondition, values: cursorValues } = this.buildCursorCondition({
      cursor,
      cursorColumn,
      orderDirection,
      direction,
      paramOffset: whereValues.length,
      isTimestampSort
    });

    const combinedWhereClause = this.combineWhereClauses({
      existingWhere: whereClause,
      cursorWhere: cursorCondition
    });
    
    // For PREV direction, we need to invert the order to get the correct previous page
    const effectiveOrderDirection = direction === PAGINATION_DIRECTIONS.PREV ? 
      (orderDirection === 'DESC' ? 'ASC' : 'DESC') : 
      orderDirection;
    // Build ORDER BY clause based on whether we have a composite sort
    const orderByClause = cursorColumn.includes(', ')
      ? cursorColumn.split(', ').map(col => `${col} ${effectiveOrderDirection}`).join(', ')
      : `${cursorColumn} ${effectiveOrderDirection}`;

    const query = `
      SELECT ${selectColumns}
      FROM ${table} ${joinClause}
      ${combinedWhereClause}
      ORDER BY ${orderByClause}
      LIMIT ${limit + 1}
    `;
    
    const queryValues = [...whereValues, ...cursorValues];

    const result = await pool.query(query, queryValues);
    let rows = result.rows as T[];

    const hasMorePages = rows.length > limit;
    if (hasMorePages) {
      rows = rows.slice(0, limit);
    }

    // For PREV direction, we need to reverse the results to maintain the original order
    if (direction === PAGINATION_DIRECTIONS.PREV && cursor) {
      rows.reverse();
    }

    const cursorInfo = this.calculateCursorInfo({
      rows,
      cursorColumn,
      hasMoreInDirection: hasMorePages,
      direction,
      currentCursor: cursor,
      resultField,
      isTimestampSort
    });

    return {
      data: rows,
      ...cursorInfo,
      totalCount: undefined
    };
  }

  /**
   * Get total count for the query (optional, can be expensive)
   */
  static async getTotalCount(params: GetTotalCountParams): Promise<number> {
    const { table, whereClause, whereValues = [], joinClause = '' } = params;
    const combinedWhereClause = whereClause ? `WHERE ${whereClause}` : '';
    const query = `
      SELECT COUNT(*) as total
      FROM ${table} ${joinClause}
      ${combinedWhereClause}
    `;

    const result = await pool.query(query, whereValues);
    return parseInt(result.rows[0].total);
  }

  /**
   * Build cursor condition for WHERE clause
   */
  private static buildCursorCondition(params: BuildCursorConditionParams): { condition: string; values: (string | number)[] } {
    const { cursor, cursorColumn, orderDirection, direction, paramOffset = 0, isTimestampSort = false } = params;

    if (!cursor) {
      return { condition: '', values: [] };
    }

    // Decide comparison operator strictly from original sort order and navigation direction
    const getOperator = (order: 'ASC' | 'DESC', nav: PaginationDirection): string => {
      // When we move "forward" (NEXT) we want values _after_ the cursor in the current sort order
      // When we move "backward" (PREV) we want values _before_ the cursor in the current sort order
      // So:
      //   ORDER ASC   -> NEXT '>' , PREV '<'
      //   ORDER DESC  -> NEXT '<' , PREV '>'
      if (nav === PAGINATION_DIRECTIONS.NEXT) {
        return order === 'DESC' ? '<' : '>';
      }
      // PREV
      return order === 'DESC' ? '>' : '<';
    };

    const operator = getOperator(orderDirection, direction);

    // Handle subquery cursor columns (like handle_count)
    if (cursorColumn.startsWith('(') && cursorColumn.endsWith(')')) {
      return {
        condition: `${cursorColumn} ${operator} $${paramOffset + 1}::integer`,
        values: [cursor],
      };
    }

    // Handle timestamp sorting with optional secondary id column for deterministic order
    if (cursorColumn.includes(', ')) {
      try {
        const cursorObj = JSON.parse(cursor);
        const [timestampCol, idCol] = cursorColumn.split(', ');

        const timestampValue = cursorObj.timestamp ?? cursorObj.sortValue;
        const idValue = cursorObj.id ?? cursorObj.pk_domain_id;

        // If we're sorting primarily by timestamp AND we have a secondary id column
        // we need the comparison to include *both* values so that rows that share
        // the same timestamp are paginated deterministically.
        if (isTimestampSort) {
          const tsParam = `$${paramOffset + 1}`;
          const idParam = `$${paramOffset + 2}`;

          // Cast timestamp part to timestamptz to keep absolute ordering in UTC
          const compositeColumn = `(${timestampCol}::timestamptz, ${idCol})`;
          const compositeValue = `(${tsParam}::timestamptz, ${idParam})`;

          return {
            condition: `${compositeColumn} ${operator} ${compositeValue}`,
            values: [timestampValue, parseInt(idValue)],
          };
        }

        // Fallback for non-timestamp composite sorts
        const tsParamFallback = `$${paramOffset + 1}`;
        const idParamFallback = `$${paramOffset + 2}`;
        return {
          condition: `(${timestampCol}, ${idCol}) ${operator} (${tsParamFallback}, ${idParamFallback})`,
          values: [timestampValue, parseInt(idValue)],
        };
      } catch (e) {
        console.error('Error parsing composite cursor:', e);
        return { condition: '', values: [] };
      }
    }

    // Handle timestamp columns (only if not composite)
    if (cursorColumn.includes('timestamp') && !cursorColumn.includes(', ')) {
      // Ensure timestamp is in ISO format
      const timestampValue = cursor.startsWith("'") && cursor.endsWith("'")
        ? cursor.slice(1, -1) // Remove quotes if present
        : cursor;

      const columnUtc = `${cursorColumn}::timestamptz`;
      return {
        condition: `${columnUtc} ${operator} $${paramOffset + 1}::timestamptz`,
        values: [timestampValue],
      };
    }

    // If the cursor value is already wrapped in quotes, it's a string
    if (cursor.startsWith("'") && cursor.endsWith("'")) {
      return {
        condition: `${cursorColumn} ${operator} ${cursor}`,
        values: [],
      };
    }

    return {
      condition: `${cursorColumn} ${operator} $${paramOffset + 1}`,
      values: [cursor],
    };
  }

  /**
   * Combine multiple WHERE clauses
   */
  private static combineWhereClauses(params: CombineWhereClausesParams): string {
    const { existingWhere, cursorWhere } = params;
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
  private static buildQuery(params: BuildQueryParams): string {
    const {
      table,
      selectColumns,
      joinClause,
      whereClause,
      cursorColumn,
      orderDirection,
      limit
    } = params;

    // For composite sorting (like timestamp + id), we need to handle ORDER BY differently
    const orderByClause = cursorColumn.includes(', ')
      ? `ORDER BY ${cursorColumn.split(', ').join(` ${orderDirection}, `)} ${orderDirection}`
      : `ORDER BY ${cursorColumn} ${orderDirection}`;

    return `
      SELECT ${selectColumns}
      FROM ${table} ${joinClause}
      ${whereClause}
      ${orderByClause}
      LIMIT ${limit}
    `;
  }

  /**
   * Calculate cursor information for pagination
   */
  private static calculateCursorInfo<T>(params: CalculateCursorInfoParams<T>): CursorInfo {
    const {
      rows,
      cursorColumn,
      hasMoreInDirection,
      direction,
      currentCursor,
      resultField,
      isTimestampSort
    } = params;

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

    // For composite sorting (timestamp + id), return the full cursor object
    if (cursorColumn.includes(', ') && isTimestampSort) {
      const [timestampCol, idCol] = cursorColumn.split(', ');
      const timestampField = timestampCol.split('.').pop()!;
      const idField = idCol.split('.').pop()!;

      const firstCursor = JSON.stringify({
        sortValue: firstRow[timestampField],
        pk_domain_id: firstRow[idField]
      });
      const lastCursor = JSON.stringify({
        sortValue: lastRow[timestampField],
        pk_domain_id: lastRow[idField]
      });

      if (direction === PAGINATION_DIRECTIONS.NEXT) {
        const hasPrev = !!currentCursor;
        return {
          hasNextPage: hasMoreInDirection,
          hasPrevPage: hasPrev,
          nextCursor: hasMoreInDirection ? lastCursor : null,
          prevCursor: hasPrev ? firstCursor : null,
        };
      } else {
        const hasNext = !!currentCursor;
        return {
          hasNextPage: hasNext,
          hasPrevPage: hasMoreInDirection,
          nextCursor: hasNext ? lastCursor : null,
          prevCursor: hasMoreInDirection ? firstCursor : null,
        };
      }
    }

    // For subquery columns, use the provided result field name
    const columnName = cursorColumn.startsWith('(') ? (resultField || cursorColumn.split('.').pop()!) : cursorColumn.split('.').pop()!;

    // Handle timestamp fields specially to ensure ISO format
    let firstCursor: string;
    let lastCursor: string;

    if (isTimestampSort && columnName.includes('timestamp')) {
      // Ensure timestamps are in ISO format
      firstCursor = new Date(firstRow[columnName] as string).toISOString();
      lastCursor = new Date(lastRow[columnName] as string).toISOString();
    } else {
      firstCursor = String(firstRow[columnName]);
      lastCursor = String(lastRow[columnName]);
    }

    if (direction === PAGINATION_DIRECTIONS.NEXT) {
      const hasPrev = !!currentCursor;
      return {
        hasNextPage: hasMoreInDirection,
        hasPrevPage: hasPrev,
        nextCursor: hasMoreInDirection ? lastCursor : null,
        prevCursor: hasPrev ? firstCursor : null,
      };
    } else {
      const hasNext = !!currentCursor;
      return {
        hasNextPage: hasNext,
        hasPrevPage: hasMoreInDirection,
        nextCursor: hasNext ? lastCursor : null,
        prevCursor: hasMoreInDirection ? firstCursor : null,
      };
    }
  }

  /**
   * Extract cursor value from a row
   */
  private static extractCursorValue(row: Record<string, unknown>, cursorColumn: string, resultField?: string): string | null {
    if (!row) return null;

    // For subquery columns, use the provided result field name
    const columnName = cursorColumn.startsWith('(')
      ? (resultField || cursorColumn.split(' ').pop()!.replace(/[()]/g, ''))
      : cursorColumn.split('.').pop()!;

    const value = row[columnName];

    // Handle timestamp fields specially to ensure ISO format
    if (columnName.includes('timestamp') && value) {
      return new Date(value as string).toISOString();
    }

    return String(value);
  }
} 
