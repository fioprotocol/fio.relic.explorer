import React from 'react';
import { Link } from 'react-router';
import Switch from 'react-switch';

import { Badge } from 'src/components/common/Badge';
import { Loader } from 'src/components/common/Loader';
import Container from 'src/components/layout/Container';
import { LoadableTable } from 'src/components/common/LoadableTable';
import { SortDropdown, SortOption } from 'src/components/common/SortDropdown';

import { useDomainsPageContext } from './DomainsPageContext';

import { ROUTES } from 'src/constants/routes';
import { formatDate } from 'src/utils/general';

import { DomainSortOption } from '@shared/types/domains';

const columns = [
  {
    key: 'domain_name',
    title: 'Domain',
  },
  {
    key: 'account',
    title: 'Account',
  },
  {
    key: 'is_public',
    title: 'Public',
  },
  {
    key: 'handle_count',
    title: 'Registered Handles',
  },
  {
    key: 'status',
    title: 'Status',
  },
  {
    key: 'expiration',
    title: 'Expiration (Burn) Date',
  },
];

const SORT_OPTIONS: SortOption<DomainSortOption>[] = [
  {
    label: 'Most Recent',
    value: 'pk_domain_id',
  },
  {
    label: 'Upcoming Expiration',
    value: 'expiration_timestamp',
  },
  {
    label: 'Most Handles',
    value: 'handle_count',
  },
];

const DomainsPage: React.FC = () => {
  const {
    loading,
    domains,
    total,
    totalActive,
    onlyPublic,
    setOnlyPublic,
    sort,
    setSort,
    paginationProps,
  } = useDomainsPageContext();

  if (domains.length === 0 && loading) {
    return (
      <Container className="py-5">
        <Loader fullScreen noBg />
      </Container>
    );
  }

  return (
    <Container className="py-3 py-md-5">
      <h4 className="mb-2">Domains</h4>
      <div className="d-flex justify-content-start align-items-start align-items-md-center gap-2 gap-md-3 text-secondary flex-wrap mb-3 mb-md-0">
        <div className="d-flex justify-content-between align-items-center gap-1 pe-5 pe-md-0 flex-grow-1 flex-sm-grow-0">
          <span>Registered Domains:</span>
          <span className="text-dark">{total}</span>
        </div>
        <div className="d-flex justify-content-between align-items-center gap-1 pe-5 pe-md-0 flex-grow-1 flex-sm-grow-0">
          <span>Active Domains:</span>
          <span className="text-dark">{totalActive}</span>
        </div>
      </div>
      <LoadableTable
        header={
          <div className="d-flex justify-content-between align-items-center gap-1 flex-wrap">
            <div className="text-nowrap">All Domains</div>
            <div className="d-flex justify-content-md-between justify-content-end align-items-center gap-2 gap-md-5 flex-wrap">
              <div className="d-flex justify-content-between align-items-center gap-2 rounded-2 p-2 border">
                <Switch
                  id="only-public"
                  handleDiameter={16}
                  width={32}
                  height={20}
                  onChange={setOnlyPublic}
                  checked={onlyPublic}
                  uncheckedIcon={false}
                  checkedIcon={false}
                />
                <label htmlFor="only-public" className="f-size-sm d-none d-sm-block">
                  Only Show Public Domains
                </label>
                <label htmlFor="only-public" className="f-size-sm d-sm-none">
                  Only Public
                </label>
              </div>
              <SortDropdown
                options={SORT_OPTIONS}
                currentSort={sort}
                onSortChange={setSort}
              />
            </div>
          </div>
        }
        columns={columns}
        data={domains.map((domain) => ({
          domain_name: (
            <Link
              to={`${ROUTES.domains.path}/${domain.domain_name}`}
              className="text-truncate text-truncate-max-w"
            >
              {domain.domain_name}
            </Link>
          ),
          account: domain.owner_account_name ? (
            <Link to={`${ROUTES.accounts.path}/${domain.owner_account_name}`}>
              {domain.owner_account_name}
            </Link>
          ) : (
            '-'
          ),
          is_public: domain.is_public ? 'Yes' : 'No',
          handle_count: domain.handle_count,
          status: (
            <Badge
              variant={domain.domain_status === 'active' ? 'success' : 'warning'}
              className="text-uppercase"
            >
              {domain.domain_status}
            </Badge>
          ),
          expiration: formatDate(domain.expiration_timestamp),
        }))}
        loading={loading}
        {...paginationProps}
        showInCardComponent
        className="mb-5"
      />
    </Container>
  );
};

export default DomainsPage;
