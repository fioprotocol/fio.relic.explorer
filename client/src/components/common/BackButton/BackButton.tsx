import { FC, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'react-bootstrap-icons';
import { Button } from 'react-bootstrap';

type BackButtonProps = {
  fallbackBackTo?: string;
  to?: string;
  onClick?: () => void;
};

export const BackButton: FC<BackButtonProps> = ({ onClick, to, fallbackBackTo }) => {
  const navigate = useNavigate();
 
  const handleClick = useCallback(() => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      if (window.history?.length && window.history.length > 1) {
        window.history.back();
      } else if (fallbackBackTo) {
        navigate(fallbackBackTo);
      }
    }
  }, [navigate, onClick, to, fallbackBackTo]);

  return (
    <Button variant="primary" onClick={handleClick} className="mb-4 p-2 lh-1">
      <ChevronLeft size={16} className="m-1" />
    </Button>
  );
};
