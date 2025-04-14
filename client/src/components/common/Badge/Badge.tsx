import { FC, ReactNode } from 'react';
import { Badge as BootstrapBadge } from 'react-bootstrap';
import { Color, Variant } from 'react-bootstrap/esm/types';

type BadgeProps = {
  children: ReactNode;
  variant?: Variant;
  textVariant?: Color;
  className?: string;
};

export const Badge: FC<BadgeProps> = ({
  children,
  variant = 'primary',
  textVariant = 'secondary',
  className,
}) => {
  return (
    <BootstrapBadge bg={variant} text={textVariant} className={`p-2 rounded-1 ${className}`}>
      {children}
    </BootstrapBadge>
  );
};
