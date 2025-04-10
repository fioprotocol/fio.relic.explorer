import { FC, ReactNode } from 'react';

import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';

import { TableComponent } from 'src/components/layout/TableComponent';
import { ActionButton } from 'src/components/common/ActionButton/ActionButton';
import { AnyObject } from '@shared/types/general';

type LoadableTableProps = {
  actionButtonText?: string;
  className?: string;
  columns: { key: string; title: string }[];
  data: AnyObject[];
  emptyState?: ReactNode;
  isLoading?: boolean;
  onActionButtonClick?: () => void;
  showActionButton?: boolean;
  title?: string;
};

export const LoadableTable: FC<LoadableTableProps> = ({
  actionButtonText,
  className,
  columns,
  data = [],
  emptyState,
  isLoading = false,
  onActionButtonClick,
  showActionButton,
  title
}) => {
  // Show loading state or empty state if needed
  const displayEmptyState = !isLoading && data.length === 0 ? emptyState : undefined;
  
  return (
    <Row className="flex-column align-items-center gap-3">
      <TableComponent 
        columns={columns} 
        data={data} 
        title={title}
        className={className}
      />
      {isLoading && <Spinner animation="border" variant="secondary" />}
      {displayEmptyState}
      {showActionButton && <ActionButton onClick={onActionButtonClick} name={actionButtonText} />}
    </Row>
  );
};
