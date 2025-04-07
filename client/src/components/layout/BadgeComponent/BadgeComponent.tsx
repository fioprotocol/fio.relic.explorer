import { FC } from 'react';
import { Alert } from 'react-bootstrap';
import { ExclamationCircleFill } from 'react-bootstrap-icons';

import styles from './BadgeComponent.module.scss';

export const BADGE_TYPE_VARIANT = {
  INFO: 'primary',
  ERROR: 'danger',
} as const;

export type BadgeComponentProps = {
  title?: string;
  message: string;
  type: typeof BADGE_TYPE_VARIANT[keyof typeof BADGE_TYPE_VARIANT];
  className?: string;
  hasDash?: boolean;
};

export const BadgeComponent: FC<BadgeComponentProps> = ({ title, message, type, className, hasDash = true }) => {  
  return (
    <Alert 
      variant={type} 
      className={`d-flex flex-row align-items-center p-3 w-100 gap-3 mb-0 rounded-4 border-0 ${styles.badgeComponent} ${styles[`${type}Badge`]} ${className || ''}`}
    >
      <ExclamationCircleFill size={20} />
      <div className={`d-flex flex-row gap-2 w-100 ${styles.badgeContent}`}>
        {title && <p className={`${styles.badgeTitle} m-0 p-0`}>{title}</p>}
        {hasDash && <span className="m-0 p-0">&ndash;</span>}
        {message && <p className="m-0 p-0">{message}</p>}
      </div>
    </Alert>
  );
};
