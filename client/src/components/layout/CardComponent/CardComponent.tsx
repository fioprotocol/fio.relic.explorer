import { FC } from 'react';
import { Card } from 'react-bootstrap';

import styles from './CardComponent.module.scss';

type CardComponentProps = {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const CardComponent: FC<CardComponentProps> = ({ children, title, className }) => {
  return <Card className={`p-4 w-100 mb-0 ${styles.cardComponent} ${className}`}>
    {title && <Card.Header className={`mb-3 p-0 border-0 ${styles.cardTitle}`}>{title}</Card.Header>}
    {children}
  </Card>
};
