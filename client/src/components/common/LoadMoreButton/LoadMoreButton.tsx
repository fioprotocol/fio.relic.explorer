import { FC, useCallback } from 'react';
import { Button } from 'react-bootstrap';

import styles from './LoadMoreButton.module.scss';

type LoadMoreButtonProps = {
  actionFn: () => void;
  name?: string;
};

export const LoadMoreButton: FC<LoadMoreButtonProps> = ({ actionFn, name = 'Load More' }) => {
  const onClick = useCallback(() => {
    actionFn && actionFn();
  }, [actionFn]);

  return <Button variant="primary" onClick={onClick} className={`w-100 align-self-center f-size-sm ${styles.button}`}>{name}</Button>;
};
