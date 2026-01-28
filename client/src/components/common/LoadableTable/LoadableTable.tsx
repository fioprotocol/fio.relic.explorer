import { FC, ReactNode } from 'react';

import { TableComponent } from 'src/components/layout/TableComponent';
import { ActionButton } from 'src/components/common/ActionButton/ActionButton';
import { Pagination } from 'src/components/common/Pagination';
import { Loader } from 'src/components/common/Loader';
import { AnyObject } from '@shared/types/general';
import { PaginationProps } from 'src/hooks/usePaginationData';
import { CardComponent } from 'src/components/layout/CardComponent';
import { PAGINATION_MODES } from '@shared/constants/pagination';
import { Alert } from '../Alert';

type LoadableTableProps = {
  actionButtonText?: string;
  className?: string;
  containerClassName?: string;
  columns: { key: string; title: string }[];
  data: AnyObject[];
  emptyState?: ReactNode;
  emptyStateMessage?: string;
  error?: Error | null | string;
  errorHeader?: string;
  onActionButtonClick?: () => void;
  showActionButton?: boolean;
  title?: string;
  showInCardComponent?: boolean;
  customMobileDesign?: ReactNode;
  header?: ReactNode;
  // Pagination props
  showPagination?: boolean;
} & PaginationProps;

export const LoadableTable: FC<LoadableTableProps> = ({
  actionButtonText,
  className,
  columns,
  data = [],
  emptyState,
  emptyStateMessage,
  loading = false,
  onActionButtonClick,
  showActionButton,
  title,
  showInCardComponent = false,
  customMobileDesign,
  header,
  // Pagination props
  showPagination = true,
  useCursorPagination = false,
  error,
  errorHeader,
  ...paginationProps
}) => {
  // Show loading state or empty state if needed
  const displayEmptyState =
    !loading && !error && data.length === 0 ? (
      emptyState ? (
        emptyState
      ) : (
        <Alert variant="info" title="No data" message={emptyStateMessage || 'No data found'} />
      )
    ) : undefined;

  const tableRender = (): ReactNode => (
    <div className="d-flex w-100 position-relative flex-column align-items-center gap-3">
      <TableComponent
        columns={columns}
        data={data}
        title={title}
        header={header}
        customMobileDesign={customMobileDesign}
        className={className}
      />

      {loading && <Loader absolute fullScreen />}
      {error && !loading && !data?.length && (
        <Alert
          variant="danger"
          title={errorHeader || 'Error'}
          message={typeof error === 'string' ? error : error?.message}
        />
      )}
      {displayEmptyState}

      {showPagination && (
        <Pagination
          {...paginationProps}
          mode={useCursorPagination ? PAGINATION_MODES.CURSOR : PAGINATION_MODES.OFFSET}
          loading={loading}
        />
      )}

      {showActionButton && <ActionButton onClick={onActionButtonClick} name={actionButtonText} />}
    </div>
  );

  if (showInCardComponent) {
    return (
      <CardComponent className="mt-4 mb-4" useMobileStyle>
        {tableRender()}
      </CardComponent>
    );
  }

  return <>{tableRender()}</>;
};
