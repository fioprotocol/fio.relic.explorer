import { FC, ReactNode } from 'react';

import Row from 'react-bootstrap/Row';

import { TableComponent } from 'src/components/layout/TableComponent';
import { ActionButton } from 'src/components/common/ActionButton/ActionButton';
import { Pagination } from 'src/components/common/Pagination';
import { Loader } from 'src/components/common/Loader';
import { AnyObject } from '@shared/types/general';
import { UsePaginationDefaultProps } from 'src/hooks/usePaginationData';
import { CardComponent } from 'src/components/layout/CardComponent';

type LoadableTableProps = {
  actionButtonText?: string;
  className?: string;
  columns: { key: string; title: string }[];
  data: AnyObject[];
  emptyState?: ReactNode;
  loading?: boolean;
  onActionButtonClick?: () => void;
  showActionButton?: boolean;
  title?: string;
  showInCardComponent?: boolean;
  // Pagination props
  showPagination?: boolean;
} & Partial<UsePaginationDefaultProps>;

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
  showInCardComponent = true,
  // Pagination props
  showPagination = true,
  ...paginationProps
}) => {
  // Show loading state or empty state if needed
  const displayEmptyState = !loading && data.length === 0 ? emptyState : undefined;

  const tableRender = (): ReactNode => (
    <Row className="position-relative flex-column align-items-center gap-3">
      <TableComponent columns={columns} data={data} title={title} className={className} />

      {loading && <Loader absolute fullScreen />}
      {displayEmptyState}

      {showPagination && <Pagination {...paginationProps} />}

      {showActionButton && <ActionButton onClick={onActionButtonClick} name={actionButtonText} />}
    </Row>
  );

  if (showInCardComponent) {
    return <CardComponent className="my-4">{tableRender()}</CardComponent>;
  }

  return <>{tableRender()}</>;
};
