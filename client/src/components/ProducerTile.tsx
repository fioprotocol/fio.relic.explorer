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
    <div className="text-secondary d-flex justify-content-start align-items-start align-items-md-center flex-md-row flex-column gap-1 gap-md-2 text-nowrap flex-wrap">
      <Link to={`${ROUTES.accounts.path}/${account}`}>{name || '-'}</Link>
      <div className="d-md-inline-block d-none vr" />
      <div className="">
        Account: <Link to={`${ROUTES.accounts.path}/${account}`}>{account}</Link>
      </div>
      <div className="d-md-inline-block d-none vr" />
      <div className="overflow-hidden text-truncate text-truncate-max-w">
        FIO Handle: {handle ? <Link to={`${ROUTES.handles.path}/${handle}`}>{handle}</Link> : '-'}
      </div>
    </div>
  );
};
