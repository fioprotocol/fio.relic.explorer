import { FC, ReactNode } from 'react';

import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';

import { TableComponent } from 'src/components/layout/TableComponent';
import { ActionButton } from 'src/components/common/ActionButton/ActionButton';
import { Pagination } from 'src/components/common/Pagination';
import { AnyObject } from '@shared/types/general';
import { UsePaginationDefaultProps } from 'src/hooks/usePaginationData';

type LoadableTableProps = {
  actionButtonText?: string;
  className?: string;
  columns: { key: string; title: string }[];
  data: AnyObject[];
  emptyState?: ReactNode;
  onActionButtonClick?: () => void;
  showActionButton?: boolean;
  title?: string;
  // Pagination props
  showPagination?: boolean;
} & UsePaginationDefaultProps;

export const LoadableTable: FC<LoadableTableProps> = ({
  actionButtonText,
  className,
  columns,
  data = [],
  emptyState,
  loading = false,
  onActionButtonClick,
  showActionButton,
  title,
  // Pagination props
  showPagination = true,
  ...paginationProps
}) => {
  // Show loading state or empty state if needed
  const displayEmptyState = !loading && data.length === 0 ? emptyState : undefined;
  
  return (
    <Row className="flex-column align-items-center gap-3">
      <TableComponent 
        columns={columns} 
        data={data} 
        title={title}
        className={className}
      />
      {loading && <Spinner animation="border" variant="secondary" />}
      {displayEmptyState}
      
      {showPagination && (
        <Pagination {...paginationProps} loading={loading} />
      )}
      
      {showActionButton && <ActionButton onClick={onActionButtonClick} name={actionButtonText} />}
    </Row>
  );
};
