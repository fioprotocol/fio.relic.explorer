import { FC } from 'react';
import { Link } from 'react-router';

import { useRegisteredHandlesContext } from './RegisteredHandlesContext';

import { Alert } from 'src/components/common/Alert';
import { Badge } from 'src/components/common/Badge';
import { Loader } from 'src/components/common/Loader';
import { LoadableTable } from 'src/components/common/LoadableTable';

import { ROUTES } from 'src/constants/routes';

const HANDLES_TABLE_COLUMNS = [
  {
    key: 'handle',
    title: 'Handle',
  },
  {
    key: 'owner_account_name',
    title: 'Account',
  },
  {
    key: 'handle_status',
    title: 'Status',
  },
];

export const RegisteredHandles: FC<{ domain: string }> = ({ domain }) => {
  const { handles, loading, paginationData } = useRegisteredHandlesContext({ domain });

  if (!handles) return <Loader />;
  if (!handles.length)
    return (
      <Alert
        variant="danger"
        title="No Registered FIO Handles"
        message="There are no registered FIO Handles associated with this FIO Handle."
      />
    );

  return (
    <LoadableTable
      columns={HANDLES_TABLE_COLUMNS}
      data={handles.map((handle) => ({
        handle: (
          <Link
            to={`${ROUTES.handles.path}/${handle.handle}`}
            className="text-truncate text-truncate-max-w"
          >
            {handle.handle}
          </Link>
        ),
        owner_account_name: handle.owner_account_name ? (
          <Link to={`${ROUTES.accounts.path}/${handle.owner_account_name}`}>
            {handle.owner_account_name}
          </Link>
        ) : (
          '-'
        ),
        handle_status: (
          <Badge
            variant={handle.handle_status === 'active' ? 'success' : 'warning'}
            className="text-uppercase"
          >
            {handle.handle_status}
          </Badge>
        ),
      }))}
      showPagination
      loading={loading}
      {...paginationData}
    />
  );
};

export default RegisteredHandles;
