import { FC, useCallback } from 'react';
import { Button } from 'react-bootstrap';

import styles from './ActionButton.module.scss';

type ActionButtonProps = {
  onClick?: () => void;
  name?: string;
};

export const ActionButton: FC<ActionButtonProps> = ({ onClick, name }) => {
  const handleClick = useCallback(() => {
    onClick && onClick();
  }, [onClick]);

  return <Button variant="primary" onClick={handleClick} className={`w-100 align-self-center f-size-sm ${styles.button}`}>{name}</Button>;
};
