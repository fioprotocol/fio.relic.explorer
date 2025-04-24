import React from 'react';
import { Link } from 'react-router';

import { Badge } from 'src/components/common/Badge';
import { Loader } from 'src/components/common/Loader';
import Container from 'src/components/layout/Container';
import { LoadableTable } from 'src/components/common/LoadableTable';

import { useHandlesPageContext } from './HandlesPageContext';

import { ROUTES } from 'src/constants/routes';
import { formatDate } from 'src/utils/general';

const columns = [
  {
    key: 'handle',
    title: 'Handle',
  },
  {
    key: 'domain',
    title: 'Domain',
  },
  {
    key: 'account',
    title: 'Account',
  },
  {
    key: 'status',
    title: 'Status',
  },
];

const HandlesPage: React.FC = () => {
  const { handles, total, totalActive, paginationProps } = useHandlesPageContext();

  return (
    <Container className="py-5">
      <h4 className="mb-2">Handles</h4>
      {handles.length === 0 ? (
        <Loader fullScreen noBg />
      ) : (
        <>
          <div className="d-flex justify-content-start align-items-start align-items-md-center gap-2 gap-md-3 text-secondary flex-wrap mb-3 mb-md-0">
            <div className="d-flex justify-content-between align-items-center gap-1 pe-5 pe-md-0 flex-grow-1 flex-sm-grow-0">
              <span>Registered Handles:</span>
              <span className="text-dark">{total}</span>
            </div>
            <div className="d-flex justify-content-between align-items-center gap-1 pe-5 pe-md-0 flex-grow-1 flex-sm-grow-0">
              <span>Active Handles:</span>
              <span className="text-dark">{totalActive}</span>
            </div>
          </div>

          <LoadableTable
            title="All Handles"
            columns={columns}
            data={handles.map((handle) => ({
              handle: (
                <Link
                  to={`${ROUTES.handles.path}/${handle.handle}`}
                  className="text-truncate text-truncate-max-w"
                >
                  {handle.handle}
                </Link>
              ),
              domain: (
                <Link to={`${ROUTES.domains.path}/${handle.domain_name}`}>
                  {handle.domain_name}
                </Link>
              ),
              account: handle.owner_account_name ? (
                <Link to={`${ROUTES.accounts.path}/${handle.owner_account_name}`}>
                  {handle.owner_account_name}
                </Link>
              ) : (
                '-'
              ),
              status: (
                <Badge
                  variant={handle.handle_status === 'active' ? 'success' : 'warning'}
                  className="text-uppercase"
                >
                  {handle.handle_status}
                </Badge>
              ),
              date: formatDate(handle.expiration_stamp),
            }))}
            {...paginationProps}
            showInCardComponent
            className="mb-5"
          />
        </>
      )}
    </Container>
  );
};

export default HandlesPage;
