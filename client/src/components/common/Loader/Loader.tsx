import { FC } from 'react';
import { Spinner } from 'react-bootstrap';

export type LoaderProps = {
  absolute?: boolean;
  fullScreen?: boolean;
  noBg?: boolean;
  className?: string;
};

export const Loader: FC<LoaderProps> = ({
  absolute = false,
  fullScreen = false,
  noBg = false,
  className = '',
}) => {
  return (
    <div
      className={`${absolute ? 'position-absolute top-0 start-0' : ''} ${fullScreen ? 'w-100 h-100' : ''} d-flex align-items-center justify-content-center ${noBg ? '' : 'bg-white bg-opacity-50'} ${className}`}
    >
      <Spinner animation="border" variant="secondary" />
    </div>
  );
};
