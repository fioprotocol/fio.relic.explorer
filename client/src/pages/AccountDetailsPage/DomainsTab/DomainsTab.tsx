import { FC } from 'react';
import { Link } from 'react-router';

import { LoadableTable } from 'src/components/common/LoadableTable';
import { Badge } from 'src/components/common/Badge';
import { ROUTES } from 'src/constants/routes';
import { formatDate } from 'src/utils/general';

import { useDomainsTabContext } from './DomainsTabContext';

const COLUMNS = [
  {
    key: 'domain_name',
    title: 'Domain',
  },
  {
    key: 'is_public',
    title: 'Public',
  },
  {
    key: 'handles_count',
    title: 'Registered Handles',
  },
  {
    key: 'status',
    title: 'Status',
  },
  {
    key: 'expiration_timestamp',
    title: 'Domain Expiration',
  },
];

export const DomainsTab: FC = () => {
  const { loading, domains, paginationData } = useDomainsTabContext();

  return (
    <LoadableTable
      columns={COLUMNS}
      data={domains?.map(
        ({ domain_name, is_public, handles_count, status, expiration_timestamp }) => ({
          domain_name: <Link to={`${ROUTES.domains.path}/${domain_name}`}>{domain_name}</Link>,
          is_public: is_public ? 'Yes' : 'No',
          handles_count: <Link to={`${ROUTES.domains.path}/${domain_name}`}>{handles_count}</Link>,
          status: (
            <Badge variant="white" className="text-uppercase">
              {status}
            </Badge>
          ),
          expiration_timestamp: formatDate(expiration_timestamp),
        })
      )}
      loading={loading}
      showPagination
      {...paginationData}
    />
  );
};
