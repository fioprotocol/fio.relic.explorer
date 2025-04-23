import React from 'react';
import { Link } from 'react-router';
import { Dropdown } from 'react-bootstrap';
import { SortDown, CheckCircle } from 'react-bootstrap-icons';
import Switch from 'react-switch';

import { Badge } from 'src/components/common/Badge';
import { DropdownToggle, DropdownItem } from 'src/components/common/Dropdown';
import { Loader } from 'src/components/common/Loader';
import Container from 'src/components/layout/Container';
import { LoadableTable } from 'src/components/common/LoadableTable';

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

const SORT_OPTIONS: { label: string; value: DomainSortOption }[] = [
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
    <Container className="py-5">
      <h4 className="mb-2">Domains</h4>
      <div className="d-flex justify-content-start align-items-center gap-3 text-secondary">
        <div>
          <span>
            Registered Domains: <span className="text-dark">{total}</span>
          </span>
        </div>
        <div>
          <span>
            Active Domains: <span className="text-dark">{totalActive}</span>
          </span>
        </div>
      </div>
      <LoadableTable
        header={
          <div className="d-flex justify-content-between align-items-center gap-3">
            <div>All Domains</div>
            <div className="d-flex justify-content-between align-items-center gap-5">
              <div className="d-flex justify-content-between align-items-center gap-2 rounded-2 p-2 border border-light">
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
                <label htmlFor="only-public" className="f-size-sm">
                  Only Show Public Domains
                </label>
              </div>
              <Dropdown align="end" className="d-none d-md-flex">
                <Dropdown.Toggle as={DropdownToggle} className="text-dark rounded-2 gap-2">
                  <SortDown size={20} className="color-primary" />
                  <span className="f-size-sm ms-2">Sort</span>
                </Dropdown.Toggle>

                <Dropdown.Menu className="rounded-3 py-2 px-3 border border-light box-shadow-default">
                  {SORT_OPTIONS.map(({ label, value }) => (
                    <Dropdown.Item
                      key={value}
                      as={DropdownItem}
                      active={sort === value}
                      disabled={sort === value}
                      onClick={(): void => setSort(value)}
                    >
                      {sort === value && <CheckCircle size={16} className="green-icon" />}
                      <span className="f-size-sm text-nowrap">{label}</span>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
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
        className="mb-5"
      />
    </Container>
  );
};

export default DomainsPage;
