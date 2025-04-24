import { FC } from 'react';
import { Card } from 'react-bootstrap';

import styles from './CardComponent.module.scss';

type CardComponentProps = {
  children: React.ReactNode;
  title?: string;
  className?: string;
  useMobileStyle?: boolean;
};

export const CardComponent: FC<CardComponentProps> = ({
  children,
  title,
  className,
  useMobileStyle,
}) => {
  return (
    <Card
      className={`w-100 mb-0 rounded-4 ${styles.cardComponent} ${useMobileStyle ? `${styles.cardComponentMobile} p-0 p-md-4` : 'p-4'} ${className || ''}`}
    >
      {title && (
        <Card.Header className={`mb-3 p-0 border-0 bg-transparent ${styles.cardTitle}`}>
          {title}
        </Card.Header>
      )}
      {children}
    </Card>
  );
};
