import { FC } from 'react';
import { Link } from 'react-router';
import { ChevronLeft } from 'react-bootstrap-icons';

import { ROUTES } from 'src/constants/routes';

type BackButtonProps = {
  to?: string;
  onClick?: () => void;
};

export const BackButton: FC<BackButtonProps> = ({ onClick, to = ROUTES.home.path }) => {
  return (
    <Link to={to} onClick={onClick} className="btn btn-primary mb-5 p-2 lh-1">
      <ChevronLeft size={16} className="m-1" />
    </Link>
  );
};
