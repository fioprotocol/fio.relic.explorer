import { FC } from 'react';
import { Alert as BootstrapAlert } from 'react-bootstrap';
import { ExclamationCircleFill } from 'react-bootstrap-icons';

import { Variant } from 'react-bootstrap/esm/types';

import styles from './Alert.module.scss';

export type AlertProps = {
  title?: string;
  message?: string | React.ReactNode;
  variant?: Variant;
  className?: string;
  hasDash?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
};

export const Alert: FC<AlertProps> = ({
  title,
  message,
  variant = 'info',
  className,
  hasDash = true,
  icon,
  children,
}) => {
  return (
    <BootstrapAlert
      variant={variant}
      className={`d-flex flex-row align-items-start p-3 w-100 gap-3 mb-0 rounded-3 border-0 bg-${variant} ${styles.alertComponent} ${className || ''}`}
    >
      {icon || <ExclamationCircleFill size={20} />}
      <div className={`d-flex flex-row gap-2 w-100 ${styles.alertContent}`}>
        {title && <p className={`${styles.alertTitle} m-0 p-0`}>{title}</p>}
        {hasDash && <span className="m-0 p-0">&ndash;</span>}
        {message && <p className="m-0 p-0">{message}</p>}
        {children}
      </div>
    </BootstrapAlert>
  );
};
