import React from 'react';
import { Link } from 'react-router';
import { Spinner } from 'react-bootstrap';

import Container from 'src/components/layout/Container';
import { LoadableTable } from 'src/components/common/LoadableTable';

import { useHandlesPageContext } from './HandlesPageContext';

import { ROUTES } from 'src/constants/routes';
import { formatDate } from 'src/utils/general';
import { Badge } from 'src/components/common/Badge';

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
        <div className="d-flex justify-content-center align-items-center">
          <Spinner color="primary" />
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-start align-items-center gap-3 text-secondary">
            <div>
              <span>
                Registered Handles: <span className="text-dark">{total}</span>
              </span>
            </div>
            <div>
              <span>
                Active Handles: <span className="text-dark">{totalActive}</span>
              </span>
            </div>
          </div>
          <LoadableTable
            title="All Handles"
            columns={columns}
            data={handles.map((handle) => ({
              handle: <div className="text-truncate text-truncate-max-w">{handle.handle}</div>,
              domain: (
                <Link to={`${ROUTES.domains.path}/${handle.domain_name}`}>
                  {handle.domain_name}
                </Link>
              ),
              account: (
                <Link to={`${ROUTES.accounts.path}/${handle.owner_account_name}`}>
                  {handle.owner_account_name}
                </Link>
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
            className="mb-5"
          />
        </>
      )}
    </Container>
  );
};

export default HandlesPage;
