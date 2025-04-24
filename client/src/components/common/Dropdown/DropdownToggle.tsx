import React from 'react';
import { Button } from 'react-bootstrap';

import { Variant } from 'react-bootstrap/esm/types';

type DropdownToggleProps = {
  children: React.ReactNode;
  variant?: Variant;
  customClassName?: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const DropdownToggle = React.forwardRef(
  (
    { children, variant, customClassName, onClick }: DropdownToggleProps,
    ref: React.Ref<HTMLButtonElement>
  ) => (
    <Button
      variant={variant || 'outline-light'}
      className={customClassName || 'text-dark rounded-2 gap-2 border'}
      ref={ref}
      onClick={(e): void => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </Button>
  )
);
