import { FC } from 'react';
import { Alert } from 'react-bootstrap';
import { InfoCircle, ExclamationTriangle } from 'react-bootstrap-icons';

import styles from './BadgeComponent.module.scss';

export const BADGE_TYPE = {
  INFO: 'info',
  ERROR: 'error',
  DANGER: 'danger',
} as const;

export type BadgeComponentProps = {
  title?: string;
  message: string;
  type: typeof BADGE_TYPE[keyof typeof BADGE_TYPE];
  className?: string;
};

export const BadgeComponent: FC<BadgeComponentProps> = ({ title, message, type, className }) => {
  const isInfoType = type === BADGE_TYPE.INFO;
  
  return (
    <Alert 
      variant={isInfoType ? BADGE_TYPE.INFO : BADGE_TYPE.DANGER} 
      className={`${styles['badge-component']} ${styles[`badge-${type}`]} ${className || ''}`}
    >
      {isInfoType ? 
        <InfoCircle size={20} /> : 
        <ExclamationTriangle size={20} />
      }
      <div className={styles['badge-content']}>
        {title && <div className={styles['badge-title']}>{title}</div>}
        <div className={styles['badge-message']}>{message}</div>
      </div>
    </Alert>
  );
}; 