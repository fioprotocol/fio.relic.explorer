import { FC } from 'react';
import { Link } from 'react-router';
import { ChevronDown, ChevronUp } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';

import Container from 'src/components/layout/Container';
import { Badge } from 'src/components/common/Badge';
import { ROUTES } from 'src/constants/routes';
import { Loader } from 'src/components/common/Loader';
import { CardComponent } from 'src/components/layout/CardComponent';

import { useProxiesPageContext, UseProxiesPageContextType, ProxyItemType } from './ProxiesPageContext';

import styles from './ProxiesPage.module.scss';

const columns: { key: keyof ProxyItemType; title: string }[] = [
  {
    title: 'Account',
    key: 'owner',
  },
  {
    title: 'FIO Handle',
    key: 'fio_address',
  },
  {
    title: 'Proxied Accounts',
    key: 'delegators',
  },
  {
    title: 'Voting For',
    key: 'vote',
  },
  {
    title: '',
    key: 'showVotes',
  },
];

// Reusable UI components and styles
const badgeClassName = `d-flex align-items-center justify-content-center f-size-sm rounded-2 ${styles.badge}`;
const mobileItemClassName = 'd-flex flex-row flex-wrap align-items-center gap-2 f-size-xs';

// Reusable component for vote list display
const VotesList: FC<{ votes: string[] }> = ({ votes }) => (
  <div className="mt-3">
    <span className="f-size-sm">Proxie votes: &nbsp;</span>
    {votes.map((voter, index) => (
      <span key={voter}>
        <Link to={`${ROUTES.accounts.path}/${voter}`} className="f-size-sm">
          {voter}
        </Link>
        {index < votes.length - 1 ? ', ' : ''}
      </span>
    ))}
  </div>
);

// Toggle votes button component
const ToggleVotesButton: FC<{ showVotes: boolean; onClick: () => void; className?: string }> = ({
  showVotes,
  onClick,
  className = ''
}) => (
  <Button
    onClick={onClick}
    className={`icon-24 d-flex align-items-center justify-content-center border-0 p-0 ${className}`}
  >
    {!showVotes ? (
      <ChevronDown className="chevron-down w-100" size={12} />
    ) : (
      <ChevronUp className="chevron-up w-100" size={12} />
    )}
  </Button>
);

// Account link component
const AccountLink: FC<{ account: string }> = ({ account }) => (
  <Link to={`${ROUTES.accounts.path}/${account}`} className="f-size-sm">
    {account}
  </Link>
);

// FIO Handle link component
const FioHandleLink: FC<{ fioAddress: string | null }> = ({ fioAddress }) => (
  fioAddress ? (
    <Link to={`${ROUTES.handles.path}/${fioAddress}`} className="f-size-sm">
      {fioAddress}
    </Link>
  ) : (
    <span className="f-size-sm">N/A</span>
  )
);

// Count badge component
const CountBadge: FC<{ count: number }> = ({ count }) => (
  <Badge variant="white" className={badgeClassName}>
    {count}
  </Badge>
);

const DesktopRenderer: FC<UseProxiesPageContextType> = ({ proxies, toggleVotes }) => (
  <>
    <div
      className={`d-grid border-1 border-top border-mercury pt-3 ${styles.gridLayout} ${styles.header}`}
    >
      {columns.map((column) => (
        <div key={column.key} className={styles.column}>
          {column.title}
        </div>
      ))}
    </div>
    {proxies?.map(({ owner, fio_address, delegators, vote, showVotes }) => (
      <div key={owner} className="border-1 border-top border-mercury pt-3">
        <div className={`d-grid ${styles.gridLayout}`}>
          <AccountLink account={owner} />
          <FioHandleLink fioAddress={fio_address} />
          <CountBadge count={delegators.length} />
          <CountBadge count={vote.length} />
          {vote.length > 0 && (
            <ToggleVotesButton
              showVotes={showVotes}
              onClick={(): void => toggleVotes(owner)}
              className={styles.button}
            />
          )}
        </div>
        {vote.length > 0 && showVotes && (
          <div className={`d-grid mt-3 ${styles.votes}`}>
            <div></div>
            <div></div>
            <div>
              <VotesList votes={vote} />
            </div>
          </div>
        )}
      </div>
    ))}
  </>
);

const MobileRenderer: FC<UseProxiesPageContextType> = ({ proxies, toggleVotes }) => {
  const columnsNames = columns.reduce(
    (acc, column) => {
      acc[column.key] = column.title;
      return acc;
    },
    {} as Record<string, string>
  );

  return (
    <>
      {proxies?.map(({ owner, fio_address, delegators, vote, showVotes }) => (
        <div
          key={owner}
          className="d-flex flex-column gap-2 border-1 border-top border-mercury pt-3"
        >
          <div className={mobileItemClassName}>
            {columnsNames['owner']}:
            <AccountLink account={owner} />
          </div>
          <div className={mobileItemClassName}>
            {columnsNames['fio_address']}:
            <FioHandleLink fioAddress={fio_address} />
          </div>
          <div className={mobileItemClassName}>
            {columnsNames['delegators']}:
            <CountBadge count={delegators.length} />
          </div>
          <div className={`${mobileItemClassName} justify-content-between`}>
            <div className={mobileItemClassName}>
              {columnsNames['vote']}:
              <CountBadge count={vote.length} />
            </div>
            {vote.length > 0 && (
              <ToggleVotesButton
                showVotes={showVotes}
                onClick={(): void => toggleVotes(owner)}
                className="align-self-end"
              />
            )}
          </div>
          {vote.length > 0 && showVotes && <VotesList votes={vote} />}
        </div>
      ))}
    </>
  );
};

const ProxiesPage: FC = () => {
  const data = useProxiesPageContext();

  return (
    <Container title="Proxies">
      <p className="f-size-sm">
        Registered Proxies: <span className="text-dark fw-bold">{data.proxies?.length}</span>
      </p>
      <CardComponent title="All Proxies" className="mb-3 ">
        {data.loading ? (
          <Loader className="mt-3" />
        ) : (
          <>
            <div className="d-md-none d-flex flex-column gap-3">
              <MobileRenderer {...data} />
            </div>
            <div className="d-none d-md-flex flex-column gap-3">
              <DesktopRenderer {...data} />
            </div>
          </>
        )}
      </CardComponent>
    </Container>
  );
};

export default ProxiesPage;
