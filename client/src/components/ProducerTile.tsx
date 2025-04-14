import React from 'react';
import { Link } from 'react-router';
import { ROUTES } from 'src/constants/routes';

interface ProducerTileProps {
  account: string;
  name?: string;
  handle?: string;
}

export const ProducerTile: React.FC<ProducerTileProps> = ({ name, account, handle }) => {
  return (
    <div className="text-secondary d-flex justify-content-start align-items-center gap-2 text-nowrap">
      <Link to={`${ROUTES.accounts.path}/${account}`}>{name || '-'}</Link>{' '}
      <div className="border-start ps-2">
        Account: <Link to={`${ROUTES.accounts.path}/${account}`}>{account}</Link>
      </div>
      <div className="border-start ps-2 overflow-hidden text-truncate text-truncate-max-w">
        FIO Handle: {handle ? <Link to={`${ROUTES.handles.path}/${handle}`}>{handle}</Link> : '-'}
      </div>
    </div>
  );
};
