import { FC } from 'react';
import { Card } from 'react-bootstrap';

import styles from './CardComponent.module.scss';

type CardComponentProps = {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const CardComponent: FC<CardComponentProps> = ({ children, title, className }) => {
  return <Card className={`${styles['card-component']} ${className}`}>
    {title && <Card.Header className={styles['card-title']}>{title}</Card.Header>}
    {children}
  </Card>
};
