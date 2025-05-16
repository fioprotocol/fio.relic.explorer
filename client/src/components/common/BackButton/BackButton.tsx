import { FC, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';

type BackButtonProps = {
  to?: string;
  onClick?: () => void;
};

export const BackButton: FC<BackButtonProps> = ({ onClick, to}) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    } else {
      to ? navigate(to) : window.history?.back();
    }
  }, [navigate, onClick, to]);

  return (
    <Button variant="primary" onClick={handleClick} className="mb-4 p-2 lh-1">
      <ChevronLeft size={16} className="m-1" />
    </Button>
  );
};
