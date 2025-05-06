import { FC } from 'react';
import { Link } from 'react-router';

import { LoadableTable } from 'src/components/common/LoadableTable';
import { ROUTES } from 'src/constants/routes';
import { Badge } from 'src/components/common/Badge';

import { useFioHandlesTabContext } from './FioHandlesTabContext';

const COLUMNS = [
  {
    key: 'handle',
    title: 'Handle',
  },
  {
    key: 'handle_status',
    title: 'Status',
  },
];

export const FioHandlesTab: FC = () => {
  const { loading, handles, paginationData } = useFioHandlesTabContext();

  return <LoadableTable columns={COLUMNS} data={handles?.map(({ handle, handle_status }) => ({
    handle: <Link to={`${ROUTES.handles.path}/${handle}`}>{handle}</Link>,
    handle_status: <Badge
      variant="white"
      className="text-uppercase"
    >
      {handle_status}
    </Badge>,
  }))} loading={loading} showPagination {...paginationData} />;
};
