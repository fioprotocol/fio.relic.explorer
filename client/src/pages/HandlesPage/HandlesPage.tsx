import React from 'react';
import { Link } from 'react-router';
import { Spinner } from 'react-bootstrap';

import Container from 'src/components/layout/Container';
import { TableComponent } from 'src/components/layout/TableComponent';
import { CardComponent } from 'src/components/layout/CardComponent';

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
  {
    key: 'date',
    title: 'Creation Date',
  },
];

const HandlesPage: React.FC = () => {
  const { handles, total, totalActive } = useHandlesPageContext();

  return (
    <Container className="py-5">
      <h4 className="mb-2">Handles</h4>
      {handles.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner color="primary" />
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-start align-items-center gap-3 text-secondary ">
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
          <CardComponent title="All Blocks" className="my-5">
            <TableComponent
              columns={columns}
              data={handles.map((handle) => ({
                handle: handle.handle,
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
                  <div className="d-inline-block border border-secondary rounded-3 px-2 py-1 text-uppercase">
                    {handle.handle_status}
                  </div>
                ),
                date: (
                  <div className="d-inline-block border border-secondary rounded-3 px-2 py-1">
                    {formatDate(handle.expiration_stamp)}
                  </div>
                ),
              }))}
            />
          </CardComponent>
        </>
      )}
    </Container>
  );
};

export default HandlesPage;
