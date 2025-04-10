import React from 'react';
import { Button } from 'react-bootstrap';
import { UsePaginationDefaultProps } from 'src/hooks/usePaginationData';

export const Pagination: React.FC<UsePaginationDefaultProps> = ({
  currentPage,
  totalPages,
  goToFirstPage,
  goToPreviousPage,
  goToNextPage,
  goToLastPage,
}) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="d-flex align-items-center justify-content-center my-3 w-100">
      <div className="d-flex flex-wrap gap-3 w-100 justify-content-center">
        <Button
          variant={isFirstPage ? "outline-secondary" : "primary"}
          onClick={goToFirstPage}
          disabled={isFirstPage}
        >
          First
        </Button>
        <Button
          variant={isFirstPage ? "outline-secondary" : "primary"}
          onClick={goToPreviousPage}
          disabled={isFirstPage}
        >
          &lt;
        </Button>
        <div className="d-flex align-self-center justify-content-center">
          <span>{currentPage} of {totalPages || 1}</span>
        </div>
        <Button
          variant={isLastPage ? "outline-secondary" : "primary"}
          onClick={goToNextPage}
          disabled={isLastPage}
        >
          &gt;
        </Button>
        <Button
          variant={isLastPage ? "outline-secondary" : "primary"}
          onClick={goToLastPage}
          disabled={isLastPage}
        >
          Last
        </Button>
      </div>
    </div>
  );
};
