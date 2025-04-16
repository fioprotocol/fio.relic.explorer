import React from 'react';
import { Button } from 'react-bootstrap';
import { ReactComponent as ChevronLeft } from '../../../assets/icons/chevron-left.svg';
import { ReactComponent as ChevronDoubleLeft } from '../../../assets/icons/chevron-double-left.svg';
import { ReactComponent as ChevronRight } from '../../../assets/icons/chevron-right.svg';
import { ReactComponent as ChevronDoubleRight } from '../../../assets/icons/chevron-double-right.svg';

import { UsePaginationDefaultProps } from 'src/hooks/usePaginationData';

import styles from './Pagination.module.scss';

export const Pagination: React.FC<UsePaginationDefaultProps> = ({
  currentPage = 1,
  totalPages,
  goToPage,
}) => {
  const isFirstPage = currentPage === 1 || !currentPage;
  const isLastPage = (currentPage || 1) === totalPages;

  return (
    <div className="d-flex align-items-center justify-content-center my-3 w-100">
      <div
        className={`d-flex flex-wrap gap-3 w-100 justify-content-center justify-content-md-end text-uppercase ${styles.pagination}`}
      >
        <Button
          variant={isFirstPage ? 'outline-secondary' : 'outline-primary'}
          onClick={(): void => goToPage?.(1)}
          disabled={isFirstPage}
        >
          <ChevronDoubleLeft />
          <span className="d-none d-md-block">First</span>
        </Button>
        <Button
          variant={isFirstPage ? 'outline-secondary' : 'outline-primary'}
          onClick={(): void => goToPage?.((currentPage ?? 1) - 1)}
          disabled={isFirstPage}
        >
          <ChevronLeft />
          <span className="d-none d-md-block">Previous</span>
        </Button>
        <Button
          variant={isLastPage ? 'outline-secondary' : 'primary'}
          onClick={(): void => goToPage?.((currentPage ?? 1) + 1)}
          disabled={isLastPage}
        >
          <span className="d-none d-md-block">Next</span>
          <ChevronRight />
        </Button>
        <Button
          variant={isLastPage ? 'outline-secondary' : 'primary'}
          onClick={(): void => goToPage?.(totalPages ?? 1)}
          disabled={isLastPage}
        >
          <span className="d-none d-md-block">Last</span>
          <ChevronDoubleRight />
        </Button>
      </div>
    </div>
  );
};
