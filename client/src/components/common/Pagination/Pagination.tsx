import React from 'react';
import { Button } from 'react-bootstrap';
import { UsePaginationDefaultProps } from 'src/hooks/usePaginationData';

export const Pagination: React.FC<UsePaginationDefaultProps> = ({
  currentPage = 1,
  totalPages,
  goToPage,
}) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="d-flex align-items-center justify-content-center my-3 w-100">
      <div className="d-flex flex-wrap gap-3 w-100 justify-content-center">
        <Button
          variant={isFirstPage ? 'outline-secondary' : 'primary'}
          onClick={(): void => goToPage?.(1)}
          disabled={isFirstPage}
        >
          First
        </Button>
        <Button
          variant={isFirstPage ? 'outline-secondary' : 'primary'}
          onClick={(): void => goToPage?.((currentPage ?? 1) - 1)}
          disabled={isFirstPage}
        >
          &lt;
        </Button>
        <div className="d-flex align-self-center justify-content-center">
          <span>
            {currentPage ?? 1} of {totalPages || 1}
          </span>
        </div>
        <Button
          variant={isLastPage ? 'outline-secondary' : 'primary'}
          onClick={(): void => goToPage?.((currentPage ?? 1) + 1)}
          disabled={isLastPage}
        >
          &gt;
        </Button>
        <Button
          variant={isLastPage ? 'outline-secondary' : 'primary'}
          onClick={(): void => goToPage?.(totalPages ?? 1)}
          disabled={isLastPage}
        >
          Last
        </Button>
      </div>
    </div>
  );
};
