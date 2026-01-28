import React, { useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { ReactComponent as ChevronLeft } from '../../../assets/icons/chevron-left.svg';
import { ReactComponent as ChevronDoubleLeft } from '../../../assets/icons/chevron-double-left.svg';
import { ReactComponent as ChevronRight } from '../../../assets/icons/chevron-right.svg';
import { ReactComponent as ChevronDoubleRight } from '../../../assets/icons/chevron-double-right.svg';

import { UsePaginationDefaultProps, CursorPaginationProps } from 'src/hooks/usePaginationData';
import { PAGINATION_LABELS, PAGINATION_MODES, PaginationMode } from '@shared/constants/pagination';

import styles from './Pagination.module.scss';

// Combined props interface
interface PaginationProps
  extends Partial<UsePaginationDefaultProps>,
    Partial<CursorPaginationProps> {
  mode?: PaginationMode;
  loading?: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  // Offset pagination props
  currentPage = 1,
  totalPages,
  goToPage,
  // Cursor pagination props
  hasNextPage,
  hasPrevPage,
  goToNext,
  goToPrev,
  goToFirst,
  goToLast,
  // Common props
  mode = PAGINATION_MODES.OFFSET,
  loading = false,
}) => {
  // Determine button states based on pagination mode
  let isFirstPage: boolean;
  let isLastPage: boolean;

  if (mode === PAGINATION_MODES.CURSOR) {
    isFirstPage = !hasPrevPage;
    isLastPage = !hasNextPage;
  } else {
    isFirstPage = currentPage === 1 || !currentPage;
    isLastPage = (currentPage || 1) === totalPages;
  }

  // Helper functions for button state management
  const getButtonVariant = useCallback((isDisabled: boolean, isPrimary = false): string => {
    if (isDisabled) return 'outline-secondary';
    return isPrimary ? 'primary' : 'outline-primary';
  }, []);

  const isButtonDisabled = useCallback(
    (condition: boolean): boolean => {
      return condition || loading;
    },
    [loading]
  );

  // Reusable button render function
  const renderButton = useCallback(
    (iconContent: React.ReactNode, onClick: () => void, isDisabled: boolean, isPrimary = false) => (
      <Button
        variant={getButtonVariant(isDisabled, isPrimary)}
        onClick={onClick}
        disabled={isDisabled}
      >
        {iconContent}
      </Button>
    ),
    [getButtonVariant]
  );

  // Handler methods for navigation actions
  /**
   * Handles navigation to first page/record
   */
  const onFirstClick = useCallback((): void => {
    if (mode === PAGINATION_MODES.CURSOR) {
      goToFirst?.();
    } else {
      goToPage?.(1);
    }
  }, [mode, goToFirst, goToPage]);

  /**
   * Handles navigation to previous page/record
   */
  const onPrevClick = useCallback((): void => {
    if (mode === PAGINATION_MODES.CURSOR) {
      goToPrev?.();
    } else {
      goToPage?.((currentPage ?? 1) - 1);
    }
  }, [mode, goToPrev, goToPage, currentPage]);

  /**
   * Handles navigation to next page/record
   */
  const onNextClick = useCallback((): void => {
    if (mode === PAGINATION_MODES.CURSOR) {
      goToNext?.();
    } else {
      goToPage?.((currentPage ?? 1) + 1);
    }
  }, [mode, goToNext, goToPage, currentPage]);

  /**
   * Handles navigation to last page/record
   */
  const onLastClick = useCallback((): void => {
    if (mode === PAGINATION_MODES.CURSOR) {
      goToLast?.();
    } else {
      goToPage?.(totalPages ?? 1);
    }
  }, [mode, goToLast, goToPage, totalPages]);

  return (
    <div className="d-flex align-items-center justify-content-center my-3 w-100">
      <div
        className={`d-flex flex-wrap gap-3 w-100 justify-content-center justify-content-md-end text-uppercase ${styles.pagination}`}
      >
        {renderButton(
          <>
            <ChevronDoubleLeft />
            <span className="d-none d-md-block">{PAGINATION_LABELS.FIRST}</span>
          </>,
          onFirstClick,
          isButtonDisabled(isFirstPage)
        )}
        {renderButton(
          <>
            <ChevronLeft />
            <span className="d-none d-md-block">{PAGINATION_LABELS.PREVIOUS}</span>
          </>,
          onPrevClick,
          isButtonDisabled(isFirstPage)
        )}
        {renderButton(
          <>
            <span className="d-none d-md-block">{PAGINATION_LABELS.NEXT}</span>
            <ChevronRight />
          </>,
          onNextClick,
          isButtonDisabled(isLastPage),
          true
        )}
        {renderButton(
          <>
            <span className="d-none d-md-block">{PAGINATION_LABELS.LAST}</span>
            <ChevronDoubleRight />
          </>,
          onLastClick,
          isButtonDisabled(isLastPage),
          true
        )}
      </div>
    </div>
  );
};
