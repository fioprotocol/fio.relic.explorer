import { FC, ReactNode } from 'react';

import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';

import { TableComponent } from 'src/components/layout/TableComponent';
import { LoadMoreButton } from 'src/components/common/LoadMoreButton';
import { AnyObject } from '@shared/types/general';

type LoadableTableProps = {
  title?: string;
  columns: { key: string; title: string }[];
  data: AnyObject[];
  loadMore?: () => void;
  hasMore?: boolean;
  emptyState?: ReactNode;
  isLoading?: boolean;
  className?: string;
};

export const LoadableTable: FC<LoadableTableProps> = ({
  title,
  columns,
  data = [],
  loadMore,
  hasMore = false,
  emptyState,
  isLoading = false,
  className
}) => {
  // Show loading state or empty state if needed
  const displayEmptyState = !isLoading && data.length === 0 ? emptyState : undefined;
  
  return (
    <Row className="flex-column align-items-center gap-3 mb-5">
      <TableComponent 
        columns={columns} 
        data={data} 
        title={title}
        className={className}
      />
      {isLoading && <Spinner animation="border" variant="secondary" />}
      {displayEmptyState}
      {hasMore && loadMore && <LoadMoreButton actionFn={loadMore} />}
    </Row>
  );
};
